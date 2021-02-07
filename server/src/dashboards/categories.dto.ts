import { IsNumber, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { PartialType } from '@nestjs/mapped-types'

export class CreateCategoryDto {
  @IsString()
  name: string

  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  parent: number
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
