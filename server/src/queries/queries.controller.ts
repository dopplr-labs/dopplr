import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { QueryResult } from 'pg'
import { PaginationDto } from 'src/dtos/pagination.dto'
import { PaginationData } from 'src/types/pagination'
import { RunQueryDto, SaveQueryDto, UpdateQueryDto } from './queries.dto'
import { QueriesService } from './queries.service'
import { Query as QueryType } from './query.entity'

@Controller('queries')
export class QueriesController {
  constructor(private queriesService: QueriesService) {}

  @Get('history')
  async getAllHistory(
    @Query() paginationDto: PaginationDto,
  ): Promise<{ success: boolean; data: PaginationData<QueryType> }> {
    const data = await this.queriesService.getAllHistory(paginationDto)
    return { success: true, data }
  }

  @Get('saved')
  async getAllSavedQueries(
    @Query() paginationDto: PaginationDto,
  ): Promise<{ success: boolean; data: PaginationData<QueryType> }> {
    const data = await this.queriesService.getAllSavedQueries(paginationDto)
    return { success: true, data }
  }

  @Get(':id')
  async getQuery(
    @Param('id') id: number,
  ): Promise<{ success: boolean; data: QueryType }> {
    const data = await this.queriesService.getQuery(id)
    return { success: true, data }
  }

  @Post('run')
  async runQuery(
    @Body() runQueryDto: RunQueryDto,
  ): Promise<{ success: boolean; data: QueryResult }> {
    const data = await this.queriesService.runQuery(runQueryDto)
    return { success: true, data }
  }

  @Post('save')
  async saveQuery(
    @Body() saveQueryDto: SaveQueryDto,
  ): Promise<{ success: boolean; data: QueryType }> {
    const data = await this.queriesService.saveQuery(saveQueryDto)
    return { success: true, data }
  }

  @Patch(':id')
  async updateQuery(
    @Param('id') id: number,
    @Body() updatedQueryDto: UpdateQueryDto,
  ): Promise<{ success: boolean; data: QueryType }> {
    const data = await this.queriesService.updateQuery(id, updatedQueryDto)
    return { success: true, data }
  }

  @Delete('history')
  async clearAllHistory(): Promise<{
    success: boolean
    data: boolean
    message: string
  }> {
    const data = await this.queriesService.clearHistory()
    return {
      success: true,
      data: false,
      message: 'history cleared successfully',
    }
  }

  @Delete(':id')
  async deleteQuery(
    @Param('id') id: number,
  ): Promise<{ success: boolean; data: QueryType }> {
    const data = await this.queriesService.deleteQuery(id)
    return { success: true, data }
  }
}
