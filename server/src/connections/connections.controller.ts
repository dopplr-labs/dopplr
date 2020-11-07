import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { Connection } from './connection.entity'
import { CreateConnectionDto, UpdateConnectionDto } from './connections.dto'
import { ConnectionsService } from './connections.service'

@Controller('connections')
export class ConnectionsController {
  constructor(private connectionsService: ConnectionsService) {}

  @Get()
  getAllConnections(): Promise<Connection[]> {
    return this.connectionsService.getAllConnections()
  }

  @Post()
  createConnection(
    @Body() createConnectionDto: CreateConnectionDto,
  ): Promise<Connection> {
    return this.connectionsService.createConnection(createConnectionDto)
  }

  @Patch(':id')
  updateConnection(
    @Param('id') id: number,
    @Body() updateConnectionDto: UpdateConnectionDto,
  ): Promise<Connection> {
    return this.connectionsService.updateConnection(id, updateConnectionDto)
  }

  @Delete(':id')
  deleteConnection(@Param('id') id: number): Promise<Connection> {
    return this.connectionsService.deleteConnection(id)
  }
}
