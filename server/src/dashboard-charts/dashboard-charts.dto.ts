import { Transform } from 'class-transformer'
import { IsNumber } from 'class-validator'

export class CreateDashboardChartDto {
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  chart: number
}
