import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common'
import { Response } from 'express'
import { AuthGuard } from 'src/auth/auth.guard'
import { GetUser } from 'src/auth/get-user.decorator'
import { QueryResult } from 'src/db-clients/client.interface'
import { PaginationDto } from 'src/dtos/pagination.dto'
import { PaginationData } from 'src/types/pagination'
import {
  DownloadQueryResultDto,
  RunQueryDto,
  SaveQueryDto,
  UpdateQueryDto,
} from './queries.dto'
import { QueriesService } from './queries.service'
import { Query as QueryType } from './query.entity'

@Controller('queries')
@UseGuards(AuthGuard)
export class QueriesController {
  constructor(private queriesService: QueriesService) {}

  @Get('history')
  async getAllHistory(
    @Query() paginationDto: PaginationDto,
    @GetUser() user,
  ): Promise<{ success: boolean; data: PaginationData<QueryType> }> {
    const data = await this.queriesService.getAllHistory(paginationDto, user)
    return { success: true, data }
  }

  @Get('saved')
  async getAllSavedQueries(
    @Query() paginationDto: PaginationDto,
    @GetUser() user,
  ): Promise<{ success: boolean; data: PaginationData<QueryType> }> {
    const data = await this.queriesService.getAllSavedQueries(
      paginationDto,
      user,
    )
    return { success: true, data }
  }

  @Get(':id')
  async getQuery(
    @Param('id') id: number,
    @GetUser() user,
  ): Promise<{ success: boolean; data: QueryType }> {
    const data = await this.queriesService.getQuery(id, user)
    return { success: true, data }
  }

  @Post('run')
  async runQuery(
    @Body() runQueryDto: RunQueryDto,
    @GetUser() user,
  ): Promise<{ success: boolean; data: QueryResult }> {
    const data = await this.queriesService.runQuery(runQueryDto, user)
    return { success: true, data }
  }

  @Post('download')
  async downloadQueryData(
    @Body() downloadQueryData: DownloadQueryResultDto,
    @GetUser() user,
    @Res() res: Response,
  ) {
    const { file, contentType } = await this.queriesService.downloadQueryResult(
      downloadQueryData,
      user,
    )
    res.attachment(`${downloadQueryData.query.slice(0, 20)}-${Date.now()}`)
    res.setHeader('Content-Type', contentType)
    return res.send(file)
  }

  @Post('save')
  async saveQuery(
    @Body() saveQueryDto: SaveQueryDto,
    @GetUser() user,
  ): Promise<{ success: boolean; data: QueryType }> {
    const data = await this.queriesService.saveQuery(saveQueryDto, user)
    return { success: true, data }
  }

  @Patch(':id')
  async updateQuery(
    @Param('id') id: number,
    @Body() updatedQueryDto: UpdateQueryDto,
    @GetUser() user,
  ): Promise<{ success: boolean; data: QueryType }> {
    const data = await this.queriesService.updateQuery(
      id,
      updatedQueryDto,
      user,
    )
    return { success: true, data }
  }

  @Delete('history')
  async clearAllHistory(
    @GetUser() user,
  ): Promise<{
    success: boolean
    data: boolean
    message: string
  }> {
    await this.queriesService.clearHistory(user)
    return {
      success: true,
      data: false,
      message: 'history cleared successfully',
    }
  }

  @Delete(':id')
  async deleteQuery(
    @Param('id') id: number,
    @GetUser() user,
  ): Promise<{ success: boolean; data: QueryType }> {
    const data = await this.queriesService.deleteQuery(id, user)
    return { success: true, data }
  }
}
