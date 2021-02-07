import { Transform } from 'class-transformer'
import { IsNumber, IsOptional } from 'class-validator'

export class CreateDashboardChartDto {
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  chart: number

  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  dashboard: number
}

export class FilterDashboardChartDto {
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  dashboard: number
}
