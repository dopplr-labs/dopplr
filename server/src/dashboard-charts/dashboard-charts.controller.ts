import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common'
import { AuthGuard } from 'src/auth/auth.guard'
import { GetUser } from 'src/auth/get-user.decorator'
import { DashboardChart } from './dashboard-chart.entity'
import { DashboardChartsService } from './dashboard-charts.service'
import {
  CreateDashboardChartDto,
  FilterDashboardChartDto,
} from './dashboard-charts.dto'

@Controller('dashboard-charts')
@UseGuards(AuthGuard)
export class DashboardChartsController {
  constructor(private dashboardChartsService: DashboardChartsService) {}

  @Get()
  async getAllDashboardCharts(
    @Query() filterDashboardChartDto: FilterDashboardChartDto,
    @GetUser() user,
  ): Promise<{ success: boolean; data: DashboardChart[] }> {
    const dashboardCharts = await this.dashboardChartsService.getAllDashboardCharts(
      filterDashboardChartDto,
      user,
    )
    return { success: true, data: dashboardCharts }
  }

  @Get(':id')
  async getDashboardChart(
    @Param('id') id: number,
    @GetUser() user,
  ): Promise<{ success: boolean; data: DashboardChart }> {
    const dashboardChart = await this.dashboardChartsService.getDashboardChart(
      id,
      user,
    )
    return { success: true, data: dashboardChart }
  }

  @Post()
  async createDashboardChart(
    @Body() createDashboardChartDto: CreateDashboardChartDto,
    @GetUser() user,
  ): Promise<{ success: boolean; data: DashboardChart }> {
    const dashboardChart = await this.dashboardChartsService.createDashboardChart(
      createDashboardChartDto,
      user,
    )
    return { success: true, data: dashboardChart }
  }

  @Delete(':id')
  async deleteChart(
    @Param('id') id: number,
    @GetUser() user,
  ): Promise<{ success: boolean; data: DashboardChart }> {
    const dashboardChart = await this.dashboardChartsService.deleteDashboardChart(
      id,
      user,
    )
    return { success: true, data: dashboardChart }
  }
}
