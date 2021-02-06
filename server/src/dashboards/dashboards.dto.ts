import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { Layout } from './dashboard.entity'

export class CreateDashboardDto {
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description: string

  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  category: number
}

export class UpdateDashboardDto {
  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description: string

  @IsOptional()
  @IsArray()
  layout: Layout[]
}
