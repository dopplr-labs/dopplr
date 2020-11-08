import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Pool } from 'pg'
import { Connection } from './connection.entity'
import { ConnectionRepository } from './connection.repository'
import { CreateConnectionDto, UpdateConnectionDto } from './connections.dto'

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectRepository(ConnectionRepository)
    private connectionsRepository: ConnectionRepository,
  ) {}

  async getConnection(id: number): Promise<Connection> {
    const connection = await this.connectionsRepository.findOne({ id })
    if (!connection) {
      throw new NotFoundException('connection not found')
    }
    return connection
  }

  getAllConnections(): Promise<Connection[]> {
    return this.connectionsRepository.find()
  }

  async createConnection(
    createConnectionDto: CreateConnectionDto,
  ): Promise<Connection> {
    return this.connectionsRepository.save(createConnectionDto)
  }

  async updateConnection(
    id: number,
    updateConnectionDto: UpdateConnectionDto,
  ): Promise<Connection> {
    return this.connectionsRepository
      .update({ id }, updateConnectionDto)
      .then(() => this.getConnection(id))
  }

  async deleteConnection(id: number): Promise<Connection> {
    const connection = await this.getConnection(id)
    await this.connectionsRepository.remove([connection])
    return connection
  }

  async testConnection(
    id: number,
  ): Promise<{ success: boolean; message: string }> {
    const connection = await this.getConnection(id)
    if (connection.type === 'postgres') {
      const pool = new Pool({
        host: connection.host,
        database: connection.database,
        user: connection.username,
        password: connection.password,
        port: connection.port,
      })
      try {
        await pool.query('SELECT NOW()')
        return { success: true, message: 'database connected successfully' }
      } catch (error) {
        return { success: false, message: error.message }
      }
    }

    return { success: false, message: 'database type not yet implemented' }
  }
}
