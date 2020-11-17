import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginationData } from 'src/types/pagination'
import { Resource } from 'src/resources/resource.entity'
import { ResourcesService } from 'src/resources/resources.service'
import { createPostgresConnectionPool } from 'src/utils/postgres'
import { PaginationDto } from 'src/dtos/pagination.dto'
import { RunQueryDto, SaveQueryDto, UpdateQueryDto } from './queries.dto'
import { Query } from './query.entity'
import { QueryRepository } from './query.repository'

@Injectable()
export class QueriesService {
  constructor(
    @InjectRepository(QueryRepository) private queryRepository: QueryRepository,
    private resourcesService: ResourcesService,
  ) {}

  async getAllHistory(
    paginationDto: PaginationDto,
  ): Promise<PaginationData<Query>> {
    const { page, limit } = paginationDto

    const totalItems = await this.queryRepository.count()
    const totalPages = Math.ceil(totalItems / limit)
    const hasMore = page < totalPages

    const queries = await this.queryRepository.find({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })

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

  async getAllSavedQueries(
    paginationDto: PaginationDto,
  ): Promise<PaginationData<Query>> {
    const { page, limit } = paginationDto

    const totalItems = await this.queryRepository.count({ isSaved: true })

    const totalPages = Math.ceil(totalItems / limit)
    const hasMore = page < totalPages

    const queries = await this.queryRepository.find({
      where: {
        isSaved: true,
      },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })

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

  async getQuery(id: number): Promise<Query> {
    const query = await this.queryRepository.findOne({ id })
    if (!query) {
      throw new NotFoundException('query not found')
    }
    return query
  }

  async deleteQuery(id: number): Promise<Query> {
    const query = await this.getQuery(id)
    await this.queryRepository.remove([query])
    return query
  }

  async createQuery(queryDto: RunQueryDto | SaveQueryDto) {
    const { resource: resourceId } = queryDto
    const resource = await this.resourcesService.getResource(resourceId)
    return this.queryRepository.save({
      ...queryDto,
      isSaved: !(queryDto instanceof RunQueryDto),
      resource,
    })
  }

  async runQuery(createQueryDto: RunQueryDto) {
    const query = await this.createQuery(createQueryDto)
    if (query.resource.type === 'postgres') {
      const result = await this._runPostgresQuery(query.query, query.resource)
      return {
        success: true,
        data: result,
        message: 'query completed successfully',
      }
    }
  }

  private async _runPostgresQuery(query: string, resource: Resource) {
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
    }
  }
}
