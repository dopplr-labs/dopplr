import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from 'src/auth/auth.guard'
import { GetUser } from 'src/auth/get-user.decorator'
import { Chart } from './chart.entity'
import { ChartsService } from './charts.service'
import { CreateChartDto } from './dto/create-chart.dto'
import { UpdateChartDto } from './dto/update-chart.dto'

@Controller('charts')
@UseGuards(AuthGuard)
export class ChartsController {
  constructor(private chartsService: ChartsService) {}

  @Post()
  async createChart(
    @Body() createChartDto: CreateChartDto,
    @GetUser() user,
  ): Promise<{ success: boolean; data: Chart }> {
    const chart = await this.chartsService.createChart(createChartDto, user)
    return { success: true, data: chart }
  }

  @Get()
  findAll() {
    return this.chartsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chartsService.findOne(+id)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateChartDto: UpdateChartDto) {
    return this.chartsService.update(+id, updateChartDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chartsService.remove(+id)
  }
}
