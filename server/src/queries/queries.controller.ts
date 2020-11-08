import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { FilterHistoryDto, RunQueryDto } from './queries.dto'
import { QueriesService } from './queries.service'

@Controller('queries')
export class QueriesController {
  constructor(private queriesService: QueriesService) {}

  @Get()
  getAllHistory(@Query() filterHistoryDto: FilterHistoryDto) {
    return this.queriesService.getAllHistory(filterHistoryDto)
  }

  @Post('/run')
  runQuery(@Body() runQueryDto: RunQueryDto) {
    return this.queriesService.runQuery(runQueryDto)
  }
}
