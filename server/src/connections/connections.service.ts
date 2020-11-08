import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { omit } from 'lodash'
import { createPostgresConnectionPool } from 'src/utils/postgres'
import { Connection } from './connection.entity'
import { ConnectionRepository } from './connection.repository'
import {
  CreateConnectionDto,
  TestConnectionDto,
  UpdateConnectionDto,
} from './connections.dto'

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectRepository(ConnectionRepository)
    private connectionsRepository: ConnectionRepository,
  ) {}

  /**
   * Returns the connection data
   *
   * @param id - Id of the connection
   */
  async getConnection(id: number): Promise<Connection> {
    const connection = await this.connectionsRepository.findOne({ id })
    if (!connection) {
      throw new NotFoundException('connection not found')
    }
    return connection
  }

  /**
   * Returns all the connections
   */
  getAllConnections(): Promise<Connection[]> {
    return this.connectionsRepository.find()
  }

  /**
   * Create a connection
   *
   * @param createConnectionDto - Data for creating connection
   */
  async createConnection(
    createConnectionDto: CreateConnectionDto,
  ): Promise<Connection> {
    return this.connectionsRepository.save(createConnectionDto)
  }

  /**
   * Updates a particular connection
   *
   * @param id - Id of the connection
   * @param updateConnectionDto - Data for updating the connection
   */
  async updateConnection(
    id: number,
    updateConnectionDto: UpdateConnectionDto,
  ): Promise<Connection> {
    return this.connectionsRepository
      .update({ id }, updateConnectionDto)
      .then(() => this.getConnection(id))
  }

  /**
   * Delete a particular connection
   *
   * @param id - Id of the connection to be deleted
   */
  async deleteConnection(id: number): Promise<Connection> {
    const connection = await this.getConnection(id)
    await this.connectionsRepository.remove([connection])
    return connection
  }

  /**
   * Test whether the configuration for a connection is valid or not
   * by connecting to the corresponding database
   *
   * @param id - Id of the connection to be tested
   */
  async testConnection(
    connection: TestConnectionDto,
  ): Promise<{ success: boolean; message: string }> {
    if (connection.type === 'postgres') {
      const pool = createPostgresConnectionPool(connection)

      try {
        await pool.query('SELECT NOW()')
        return { success: true, message: 'database connected successfully' }
      } catch (error) {
        throw new InternalServerErrorException(error)
      } finally {
        pool.end()
      }
    }

    throw new InternalServerErrorException('database type not yet implemented')
  }

  /**
   * Fetch schema for a particular connection
   *
   * @param id - Id of the connection whose schema is to be fetched
   */
  async fetchSchema(id: number): Promise<{ success: boolean; data: any[] }> {
    const connection = await this.getConnection(id)

    if (connection.type === 'postgres') {
      const pool = createPostgresConnectionPool(connection)

      try {
        const { rows: tableRows } = await pool.query(
          "SELECT * from information_schema.tables where table_schema != 'pg_catalog' AND table_schema != 'information_schema';",
        )
        const tables = tableRows.map(row => row.table_name)
        const tableRowQueries = await Promise.all(
          tables.map(table =>
            pool.query(
              `SELECT * FROM information_schema.columns WHERE table_name = '${table}'`,
            ),
          ),
        )
        return {
          success: true,
          data: tables.map((table, index) => {
            return {
              table,
              columns: tableRowQueries[index].rows.map(row =>
                omit(row, ['table_catalog', 'table_name', 'table_schema']),
              ),
            }
          }),
        }
      } catch (error) {
        throw new InternalServerErrorException(error)
      } finally {
        pool.end()
      }
    }

    throw new InternalServerErrorException('database type not yet implemented')
  }
}
