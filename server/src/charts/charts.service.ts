import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/user.types'
import { QueriesService } from 'src/queries/queries.service'
import { Chart } from './chart.entity'
import { ChartRepository } from './chart.repository'
import { CreateChartDto, UpdateChartDto } from './charts.dto'

@Injectable()
export class ChartsService {
  constructor(
    @InjectRepository(ChartRepository)
    private chartsRepository: ChartRepository,
    @Inject(forwardRef(() => QueriesService))
    private queriesService: QueriesService,
  ) {}

  /**
   * Returns all the charts
   *
   * @param user
   * @param query
   */
  async getAllCharts(user: User, query?: number): Promise<Chart[]> {
    const charts = await this.chartsRepository.find({
      order: { createdAt: 'ASC' },
      where: { uid: user.uid, query: query },
    })
    return charts
  }

  /**
   * Returns the chart data
   *
   * @param id
   * @param user
   */
  async getChart(id: number, user: User): Promise<Chart> {
    const chart = await this.chartsRepository.findOne({
      id,
      uid: user.uid,
    })
    return chart
  }

  /**
   * Create a chart
   *
   * @param createChartDto
   * @param user
   */
  async createChart(
    createChartDto: CreateChartDto,
    user: User,
  ): Promise<Chart> {
    const { query: queryId } = createChartDto
    const query = await this.queriesService.getQuery(queryId, user)
    return this.chartsRepository.save({
      ...createChartDto,
      query,
      uid: user.uid,
    })
  }

  /**
   * Updates a particular chart
   *
   * @param id
   * @param updateChartDto
   * @param user
   */
  async updateChart(
    id: number,
    updateChartDto: UpdateChartDto,
    user: User,
  ): Promise<Chart> {
    return this.chartsRepository
      .update({ id, uid: user.uid }, updateChartDto)
      .then(() => this.getChart(id, user))
  }

  /**
   * Delete a particular chart
   *
   * @param id
   * @param user
   */
  async deleteChart(id: number, user: User): Promise<Chart> {
    const chart = await this.getChart(id, user)
    await this.chartsRepository.remove([chart])
    return { ...chart, id }
  }
}
