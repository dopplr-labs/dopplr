import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { PaginationDto } from 'src/dtos/pagination.dto'
import { RunQueryDto, SaveQueryDto, UpdateQueryDto } from './queries.dto'
import { QueriesService } from './queries.service'

@Controller('queries')
export class QueriesController {
  constructor(private queriesService: QueriesService) {}

  @Get('history')
  getAllHistory(@Query() paginationDto: PaginationDto) {
    return this.queriesService.getAllHistory(paginationDto)
  }

  @Get('saved')
  getAllSavedQueries(@Query() paginationDto: PaginationDto) {
    return this.queriesService.getAllSavedQueries(paginationDto)
  }

  @Get(':id')
  getQuery(@Param('id') id: number) {
    return this.queriesService.getQuery(id)
  }

  @Post('/run')
  runQuery(@Body() runQueryDto: RunQueryDto) {
    return this.queriesService.runQuery(runQueryDto)
  }

  @Post('/save')
  saveQuery(@Body() saveQueryDto: SaveQueryDto) {
    return this.queriesService.createQuery(saveQueryDto)
  }

  @Patch(':id')
  updateQuery(
    @Param('id') id: number,
    @Body() updatedQueryDto: UpdateQueryDto,
  ) {
    return this.queriesService.updateQuery(id, updatedQueryDto)
  }
}
