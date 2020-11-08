import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { Connection } from './connection.entity'
import {
  CreateConnectionDto,
  TestConnectionDto,
  UpdateConnectionDto,
} from './connections.dto'
import { ConnectionsService } from './connections.service'

@Controller('connections')
export class ConnectionsController {
  constructor(private connectionsService: ConnectionsService) {}

  @Get()
  getAllConnections(): Promise<Connection[]> {
    return this.connectionsService.getAllConnections()
  }

  @Get(':id')
  async getConnection(
    @Param('id') id: number,
  ): Promise<{ success: boolean; data: Connection }> {
    const connection = await this.connectionsService.getConnection(id)
    return { success: true, data: connection }
  }

  @Post()
  async createConnection(
    @Body() createConnectionDto: CreateConnectionDto,
  ): Promise<{ success: boolean; data: Connection }> {
    const connection = await this.connectionsService.createConnection(
      createConnectionDto,
    )
    return { success: true, data: connection }
  }

  @Patch(':id')
  async updateConnection(
    @Param('id') id: number,
    @Body() updateConnectionDto: UpdateConnectionDto,
  ): Promise<{ success: boolean; data: Connection }> {
    const connection = await this.connectionsService.updateConnection(
      id,
      updateConnectionDto,
    )
    return { success: true, data: connection }
  }

  @Delete(':id')
  async deleteConnection(
    @Param('id') id: number,
  ): Promise<{ success: boolean; data: Connection }> {
    const connection = await this.connectionsService.deleteConnection(id)
    return { success: true, data: connection }
  }

  @Post('test')
  @HttpCode(200)
  async testConnection(
    @Body() testConnectionDto: TestConnectionDto,
  ): Promise<{ success: boolean; message: string }> {
    return this.connectionsService.testConnection(testConnectionDto)
  }

  @Post('schema/:id')
  @HttpCode(200)
  async fetchSchema(
    @Param('id') id: number,
  ): Promise<{ success: boolean; data: any[] }> {
    return this.connectionsService.fetchSchema(id)
  }
}
