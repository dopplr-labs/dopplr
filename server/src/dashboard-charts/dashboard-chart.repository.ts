import { EntityRepository, Repository } from 'typeorm'
import { DashboardChart } from './dashboard-chart.entity'

@EntityRepository(DashboardChart)
export class DashboardChartRespository extends Repository<DashboardChart> {}
