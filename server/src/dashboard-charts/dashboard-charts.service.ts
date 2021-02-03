import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/user.types'
import { ChartsService } from 'src/charts/charts.service'
import { DashboardChart } from './dashboard-chart.entity'
import { DashboardChartRespository } from './dashboard-chart.repository'
import { CreateDashboardChartDto } from './dashboard-charts.dto'

@Injectable()
export class DashboardChartsService {
  constructor(
    @InjectRepository(DashboardChartRespository)
    private dashboardChartsRepository: DashboardChartRespository,
    @Inject(forwardRef(() => ChartsService))
    private chartsService: ChartsService,
  ) {}

  async getAllDashboardCharts(user: User): Promise<DashboardChart[]> {
    const dashboardCharts = await this.dashboardChartsRepository.find({
      order: { createdAt: 'DESC' },
      where: { uid: user.uid },
    })
    return dashboardCharts
  }

  async getDashboardChart(id: number, user: User): Promise<DashboardChart> {
    const dashboardChart = await this.dashboardChartsRepository.findOne({
      id,
      uid: user.uid,
    })
    return dashboardChart
  }

  async createDashboardChart(
    createDashboardChartDto: CreateDashboardChartDto,
    user: User,
  ): Promise<DashboardChart> {
    const { chart: chartId } = createDashboardChartDto
    const chart = await this.chartsService.getChart(chartId, user)
    return this.dashboardChartsRepository.save({
      ...createDashboardChartDto,
      chart,
      uid: user.uid,
    })
  }

  async deleteDashboardChart(id: number, user: User): Promise<DashboardChart> {
    const dashboardChart = await this.getDashboardChart(id, user)
    await this.dashboardChartsRepository.remove([dashboardChart])
    return { ...dashboardChart, id }
  }
}
