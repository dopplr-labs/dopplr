import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { ChartType } from './chart.entity'

export class CreateChartDto {
  @IsOptional()
  @IsString()
  name: string

  @IsString()
  label: string

  @IsString({ each: true })
  values: string[]

  @IsEnum(ChartType)
  type: ChartType

  @IsNumber()
  query: number
}

export class UpdateChartDto {}
