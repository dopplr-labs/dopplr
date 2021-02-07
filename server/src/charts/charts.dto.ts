import { Transform } from 'class-transformer'
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

  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  query: number
}

export class UpdateChartDto {
  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  label: string

  @IsOptional()
  @IsString({ each: true })
  values: string[]

  @IsOptional()
  @IsEnum(ChartType)
  type: ChartType
}

export class FilterChartDto {
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  query?: number
}
