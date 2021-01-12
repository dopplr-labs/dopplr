import { PartialType } from '@nestjs/mapped-types'
import { CreateChartDto } from './create-chart.dto'

export class UpdateChartDto extends PartialType(CreateChartDto) {}
