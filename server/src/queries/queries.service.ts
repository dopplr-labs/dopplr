import {
  ForbiddenException,
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
import { RunQueryDto, SaveQueryDto, UpdateQueryDto } from './queries.dto'
import { Query } from './query.entity'
import { QueryRepository } from './query.repository'

@Injectable()
export class QueriesService {
  constructor(
    @InjectRepository(QueryRepository) private queryRepository: QueryRepository,
    private resourcesService: ResourcesService,
  ) {}

  /**
   * Get all the history queries
   *
   * @param paginationDto - Pagination configuration
   */
  async getAllHistory(
    paginationDto: PaginationDto,
  ): Promise<PaginationData<Query>> {
    const { page, limit } = paginationDto

    const totalItems = await this.queryRepository.count({ isSaved: false })
    const totalPages = Math.ceil(totalItems / limit)
    const hasMore = page < totalPages

    const queries = await this.queryRepository
      .find({
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
        where: {
          isSaved: false,
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
  ): Promise<PaginationData<Query>> {
    const { page, limit } = paginationDto

    const totalItems = await this.queryRepository.count({ isSaved: true })
    const totalPages = Math.ceil(totalItems / limit)
    const hasMore = page < totalPages

    const queries = await this.queryRepository
      .find({
        where: {
          isSaved: true,
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
  async getQuery(id: number): Promise<Query> {
    const query = await this.queryRepository.findOne({ id })
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
  async saveQuery(saveQueryDto: SaveQueryDto): Promise<Query> {
    const { resource: resourceId } = saveQueryDto
    const resource = await this.resourcesService.getResource(resourceId)
    return this.queryRepository.save({
      ...saveQueryDto,
      isSaved: true,
      resource,
    })
  }

  /**
   * Run a query for a particular resource
   *
   * @param runQueryDto - Data of the query to be run
   */
  async runQuery(runQueryDto: RunQueryDto): Promise<QueryResult> {
    const { resource: resourceId, query } = runQueryDto
    const resource = await this.resourcesService.getResource(resourceId, false)
    if (resource.type === 'postgres') {
      await this.queryRepository.save({
        ...runQueryDto,
        isSaved: false,
        resource: this.resourcesService.encryptResource(resource),
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
  ): Promise<Query> {
    const { resource, ...restData } = updateQueryDto

    let resourceEntity
    if (typeof resource !== 'undefined') {
      resourceEntity = await this.resourcesService.getResource(resource)
    }
    const updatedQueryData = { ...restData, resource: resourceEntity }

    const query = await this.getQuery(id)
    if (!query.isSaved) {
      throw new ForbiddenException('only saved queries can be updated')
    }

    await this.queryRepository.update({ id }, updatedQueryData)

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
  async deleteQuery(id: number): Promise<Query> {
    const query = await this.getQuery(id)
    await this.queryRepository.remove([query])
    return query
  }

  /**
   * Clear the entire history or unsaved queries
   */
  async clearHistory(): Promise<boolean> {
    try {
      await this.queryRepository.delete({ isSaved: false })
      return true
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}
