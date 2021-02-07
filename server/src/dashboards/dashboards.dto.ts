import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { PartialType } from '@nestjs/mapped-types'
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

  @IsOptional()
  @IsArray()
  layout: Layout[]
}

export class UpdateDashboardDto extends PartialType(CreateDashboardDto) {}
