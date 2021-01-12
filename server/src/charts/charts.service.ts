import { Injectable } from '@nestjs/common'
import { CreateChartDto } from './dto/create-chart.dto'
import { UpdateChartDto } from './dto/update-chart.dto'

@Injectable()
export class ChartsService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createChartDto: CreateChartDto) {
    return 'This action adds a new chart'
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
