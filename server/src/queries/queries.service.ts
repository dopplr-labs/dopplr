import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginationData } from 'src/types/pagination'
import { ResourcesService } from 'src/resources/resources.service'
import { createPostgresConnectionPool } from 'src/utils/postgres'
import { PaginationDto } from 'src/dtos/pagination.dto'
import { QueryResult } from 'pg'
import { User } from 'src/auth/user.types'
import { Resource } from 'src/resources/resource.entity'
import { RunQueryDto, SaveQueryDto, UpdateQueryDto } from './queries.dto'
import { Query } from './query.entity'
import { QueryRepository } from './query.repository'

@Injectable()
export class QueriesService {
  constructor(
    @InjectRepository(QueryRepository) private queryRepository: QueryRepository,
    @Inject(forwardRef(() => ResourcesService))
    private resourcesService: ResourcesService,
  ) {}

  /**
   * Get all the history queries
   *
   * @param paginationDto - Pagination configuration
   */
  async getAllHistory(
    paginationDto: PaginationDto,
    user: User,
  ): Promise<PaginationData<Query>> {
    const { page, limit } = paginationDto

    const totalItems = await this.queryRepository.count({
      isSaved: false,
      uid: user.uid,
    })
    const totalPages = Math.ceil(totalItems / limit)
    const hasMore = page < totalPages

    const queries = await this.queryRepository
      .find({
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
        where: {
          isSaved: false,
          uid: user.uid,
        },
      })
      .then(queries =>
        queries.map(query => ({
          ...query,
          resource: this.resourcesService.encryptResource(query.resource),
        })),
      )

    return {
      items: queries,
      meta: {
        hasMore,
        totalItems,
        currentPage: page,
        nextPage: hasMore ? page + 1 : page,
      },
    }
  }

  /**
   * Get all the saved queries
   *
   * @param paginationDto - Pagination configuration
   */
  async getAllSavedQueries(
    paginationDto: PaginationDto,
    user: User,
  ): Promise<PaginationData<Query>> {
    const { page, limit } = paginationDto

    const totalItems = await this.queryRepository.count({
      isSaved: true,
      uid: user.uid,
    })
    const totalPages = Math.ceil(totalItems / limit)
    const hasMore = page < totalPages

    const queries = await this.queryRepository
      .find({
        where: {
          isSaved: true,
          uid: user.uid,
        },
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      })
      .then(queries =>
        queries.map(query => ({
          ...query,
          resource: this.resourcesService.encryptResource(query.resource),
        })),
      )

    return {
      items: queries,
      meta: {
        hasMore,
        totalItems,
        currentPage: page,
        nextPage: hasMore ? page + 1 : page,
      },
    }
  }

  /**
   * Get data for a particular resource
   *
   * @param id - Id of the resource
   */
  async getQuery(id: number, user: User): Promise<Query> {
    const query = await this.queryRepository.findOne({ id, uid: user.uid })
    if (!query) {
      throw new NotFoundException('query not found')
    }
    return query
  }

  /**
   * Save the query
   *
   * @param saveQueryDto - Data of the query to be saved
   */
  async saveQuery(saveQueryDto: SaveQueryDto, user: User): Promise<Query> {
    const { resource: resourceId } = saveQueryDto
    const resource = await this.resourcesService.getResource(resourceId, user)
    return this.queryRepository.save({
      ...saveQueryDto,
      isSaved: true,
      resource: this.resourcesService.encryptResource(resource),
      uid: user.uid,
    })
  }

  /**
   * Run a query for a particular resource
   *
   * @param runQueryDto - Data of the query to be run
   */
  async runQuery(runQueryDto: RunQueryDto, user: User): Promise<QueryResult> {
    const { resource: resourceId, query } = runQueryDto
    const resource = await this.resourcesService.getResource(
      resourceId,
      user,
      false,
    )
    if (resource.type === 'postgres') {
      await this.queryRepository.save({
        ...runQueryDto,
        isSaved: false,
        resource: this.resourcesService.encryptResource(resource),
        uid: user.uid,
      })
      const pool = createPostgresConnectionPool(resource)
      try {
        const result = await pool.query(query)
        return result
      } catch (error) {
        throw new InternalServerErrorException(error)
      } finally {
        pool.end()
      }
    }

    throw new InternalServerErrorException('database type not yet implemented')
  }

  /**
   * Update the saved query
   *
   * @param id - Id of the **saved** query to be updated
   * @param updateQueryDto - Updated data of the query
   */
  async updateQuery(
    id: number,
    updateQueryDto: UpdateQueryDto,
    user: User,
  ): Promise<Query> {
    const { resource, ...restData } = updateQueryDto

    const updatedQueryData: any = { ...restData }

    let resourceEntity
    if (typeof resource !== 'undefined') {
      resourceEntity = await this.resourcesService.getResource(resource, user)
      updatedQueryData.resource = resourceEntity
    }

    const query = await this.getQuery(id, user)
    if (!query.isSaved) {
      throw new ForbiddenException('only saved queries can be updated')
    }

    await this.queryRepository.update({ id, uid: user.uid }, updatedQueryData)

    return {
      ...query,
      ...updatedQueryData,
      resource: this.resourcesService.encryptResource(
        resourceEntity ?? query.resource,
      ),
    }
  }

  /**
   * Delete a particular query
   *
   * @param id - Id of the query to be deleted
   */
  async deleteQuery(id: number, user: User): Promise<Query> {
    const query = await this.getQuery(id, user)
    await this.queryRepository.remove([query])
    return { ...query, id }
  }

  /**
   * Clear the entire history or unsaved queries
   */
  async clearHistory(user: User): Promise<boolean> {
    try {
      await this.queryRepository.delete({ isSaved: false, uid: user.uid })
      return true
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   * Delete all the queries for a particular resource
   *
   * @param resource - Resource for which all the queries are to be deleted
   * @param user - User deleting all the queries for a resource
   */
  deleteQueriesForResource(resource: Resource, user: User) {
    this.queryRepository.delete({ resource, uid: user.uid })
  }
}
