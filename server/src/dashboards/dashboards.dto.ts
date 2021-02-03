import { IsArray, IsOptional, IsString } from 'class-validator'
import { Layout } from './dashboard.entity'

export class CreateDashboardDto {
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description: string
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
