import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/user.types'
import { Chart } from './chart.entity'
import { ChartRepository } from './chart.repository'
import { CreateChartDto } from './dto/create-chart.dto'
import { UpdateChartDto } from './dto/update-chart.dto'

@Injectable()
export class ChartsService {
  constructor(
    @InjectRepository(ChartRepository)
    private chartsRepository: ChartRepository,
  ) {}

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
    return this.chartsRepository.save({ ...createChartDto, uid: user.uid })
  }

  findAll() {
    return 'This action returns all charts'
  }

  findOne(id: number) {
    return `This action returns a #${id} chart`
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateChartDto: UpdateChartDto) {
    return `This action updates a #${id} chart`
  }

  remove(id: number) {
    return `This action removes a #${id} chart`
  }
}
