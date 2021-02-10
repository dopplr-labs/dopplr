import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/user.types'
import { ChartsService } from 'src/charts/charts.service'
import { DashboardsService } from 'src/dashboards/dashboards.service'
import { DashboardChart } from './dashboard-chart.entity'
import { DashboardChartRespository } from './dashboard-chart.repository'
import {
  CreateDashboardChartDto,
  FilterDashboardChartDto,
} from './dashboard-charts.dto'

@Injectable()
export class DashboardChartsService {
  constructor(
    @InjectRepository(DashboardChartRespository)
    private dashboardChartsRepository: DashboardChartRespository,
    @Inject(forwardRef(() => ChartsService))
    private chartsService: ChartsService,
    @Inject(forwardRef(() => DashboardsService))
    private dashboardsService: DashboardsService,
  ) {}

  /**
   * Returns all the dashboardCharts
   *
   * @param filterDashboardChartDto - dashboard id to get all dashboardCharts for a particular dashboard
   * @param user
   */
  async getAllDashboardCharts(
    filterDashboardChartDto: FilterDashboardChartDto,
    user: User,
  ): Promise<DashboardChart[]> {
    const { dashboard } = filterDashboardChartDto
    const where: { uid: string; dashboard?: { id: number } } = { uid: user.uid }

    if (dashboard) {
      where.dashboard = { id: dashboard }
    }
    const dashboardCharts = await this.dashboardChartsRepository.find({
      order: { createdAt: 'DESC' },
      where,
    })
    return dashboardCharts
  }

  /**
   * Returns the dashboardChart data
   *
   * @param id - id of the dashboardChart user wants to fetch
   * @param user
   */
  async getDashboardChart(id: number, user: User): Promise<DashboardChart> {
    const dashboardChart = await this.dashboardChartsRepository.findOne({
      id,
      uid: user.uid,
    })
    if (!dashboardChart) {
      throw new NotFoundException('dashboard-chart not found')
    }
    return dashboardChart
  }

  /**
   * Create a dashboardChart
   *
   * @param createDashboardChartDto - Data for creating a new dashboardChart
   * @param user
   */
  async createDashboardChart(
    createDashboardChartDto: CreateDashboardChartDto,
    user: User,
  ): Promise<DashboardChart> {
    const COLS_NUMBER = 12
    const MAX_Y = 9999
    const { chart: chartId, dashboard: dashboardId } = createDashboardChartDto
    const dashboard = await this.dashboardsService.getDashboard(
      dashboardId,
      user,
    )
    const chart = await this.chartsService.getChart(chartId, user)
    const dashboardChart = await this.dashboardChartsRepository.save({
      ...createDashboardChartDto,
      dashboard,
      chart,
      uid: user.uid,
    })
    const prevLayout = dashboard.layout
    const newLayout = {
      i: dashboardChart.id.toString(),
      x: prevLayout ? (prevLayout.length * 6) % COLS_NUMBER : 0,
      y: MAX_Y,
      w: 6,
      h: 4,
    }
    const newDashboardLayout = prevLayout
      ? [...prevLayout, newLayout]
      : [newLayout]

    await this.dashboardsService.updateDashboard(
      dashboardId,
      {
        layout: newDashboardLayout,
      },
      user,
    )
    return dashboardChart
  }

  /**
   * Delete a particular dashboardChart
   *
   * @param id - id of the dashboardChart user wants to delete
   * @param user
   */
  async deleteDashboardChart(id: number, user: User): Promise<DashboardChart> {
    const dashboardChart = await this.getDashboardChart(id, user)
    await this.dashboardChartsRepository.remove([dashboardChart])
    return { ...dashboardChart, id }
  }
}
