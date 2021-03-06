import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
  Query,
} from '@nestjs/common'
import { AuthGuard } from 'src/auth/auth.guard'
import { GetUser } from 'src/auth/get-user.decorator'
import { Chart } from './chart.entity'
import { ChartsService } from './charts.service'
import { CreateChartDto, FilterChartDto, UpdateChartDto } from './charts.dto'

@Controller('charts')
@UseGuards(AuthGuard)
export class ChartsController {
  constructor(private chartsService: ChartsService) {}

  @Get()
  async getAllCharts(
    @Query() filterChartDto: FilterChartDto,
    @GetUser() user,
  ): Promise<{ success: boolean; data: Chart[] }> {
    const charts = await this.chartsService.getAllCharts(filterChartDto, user)
    return { success: true, data: charts }
  }

  @Get(':id')
  async getChart(
    @Param('id') id: number,
    @GetUser() user,
  ): Promise<{ success: boolean; data: Chart }> {
    const chart = await this.chartsService.getChart(id, user)
    return { success: true, data: chart }
  }

  @Post()
  async createChart(
    @Body() createChartDto: CreateChartDto,
    @GetUser() user,
  ): Promise<{ success: boolean; data: Chart }> {
    const chart = await this.chartsService.createChart(createChartDto, user)
    return { success: true, data: chart }
  }

  @Patch(':id')
  async updateChart(
    @Param('id') id: number,
    @Body() updateChartDto: UpdateChartDto,
    @GetUser() user,
  ): Promise<{ success: boolean; data: Chart }> {
    const chart = await this.chartsService.updateChart(id, updateChartDto, user)
    return { success: true, data: chart }
  }

  @Delete(':id')
  async deleteChart(
    @Param('id') id: number,
    @GetUser() user,
  ): Promise<{ success: boolean; data: Chart }> {
    const chart = await this.chartsService.deleteChart(id, user)
    return { success: true, data: chart }
  }
}
