import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Resource } from 'src/resources/resource.entity'
import { ResourcesService } from 'src/resources/resources.service'
import { createPostgresConnectionPool } from 'src/utils/postgres'
import { FilterHistoryDto, RunQueryDto, SaveQueryDto } from './queries.dto'
import { Query } from './query.entity'
import { QueryRepository } from './query.repository'

@Injectable()
export class QueriesService {
  constructor(
    @InjectRepository(QueryRepository) private queryRepository: QueryRepository,
    private resourcesService: ResourcesService,
  ) {}

  async runQuery(createQueryDto: RunQueryDto) {
    const query = await this._createQuery(createQueryDto)
    if (query.resource.type === 'postgres') {
      const result = await this._runPostgresQuery(query.query, query.resource)
      return {
        success: true,
        data: result,
        message: 'query completed successfully',
      }
    }
  }

  async _createQuery(queryDto: RunQueryDto | SaveQueryDto) {
    const { resource: resourceId } = queryDto
    const resource = await this.resourcesService.getResource(resourceId)
    return this.queryRepository.save({
      ...queryDto,
      isSaved: !(queryDto instanceof RunQueryDto),
      resource,
    })
  }

  async _runPostgresQuery(query: string, resource: Resource) {
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

  async getAllHistory(filterHistoryDto: FilterHistoryDto): Promise<Query[]> {
    const { resource: resourceId } = filterHistoryDto
    return this.queryRepository.find({ resource: { id: resourceId } })
  }

  async getHistory(id: number): Promise<Query> {
    return this.queryRepository.findOne({ id })
  }
}
