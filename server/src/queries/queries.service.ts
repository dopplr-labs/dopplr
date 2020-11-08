import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Connection } from 'src/connections/connection.entity'
import { ConnectionsService } from 'src/connections/connections.service'
import { createPostgresConnectionPool } from 'src/utils/postgres'
import { FilterHistoryDto, RunQueryDto, SaveQueryDto } from './queries.dto'
import { Query } from './query.entity'
import { QueryRepository } from './query.repository'

@Injectable()
export class QueriesService {
  constructor(
    @InjectRepository(QueryRepository) private queryRepository: QueryRepository,
    private connectionsService: ConnectionsService,
  ) {}

  async runQuery(createQueryDto: RunQueryDto) {
    const query = await this._createQuery(createQueryDto)
    if (query.connection.type === 'postgres') {
      const result = await this._runPostgresQuery(query.query, query.connection)
      return {
        success: true,
        data: result,
        message: 'query completed successfully',
      }
    }
  }

  async _createQuery(queryDto: RunQueryDto | SaveQueryDto) {
    const { connection: connectionId } = queryDto
    const connection = await this.connectionsService.getConnection(connectionId)
    return this.queryRepository.save({
      ...queryDto,
      isSaved: !(queryDto instanceof RunQueryDto),
      connection,
    })
  }

  async _runPostgresQuery(query: string, connection: Connection) {
    const pool = createPostgresConnectionPool(connection)
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
    const { connection: connectionId } = filterHistoryDto
    return this.queryRepository.find({ connection: { id: connectionId } })
  }

  async getHistory(id: number): Promise<Query> {
    return this.queryRepository.findOne({ id })
  }
}
