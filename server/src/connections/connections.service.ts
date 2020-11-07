import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Connection } from './connection.entity'
import { ConnectionRepository } from './connection.repository'
import { CreateConnectionDto, UpdateConnectionDto } from './connections.dto'

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectRepository(ConnectionRepository)
    private connectionsRepository: ConnectionRepository,
  ) {}

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
      .then(() => this.connectionsRepository.findOne({ id }))
  }

  async deleteConnection(id: number): Promise<Connection> {
    const connection = await this.connectionsRepository.findOne({ id })
    await this.connectionsRepository.remove([connection])
    return connection
  }
}
