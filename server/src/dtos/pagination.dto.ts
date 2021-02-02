import { Transform } from 'class-transformer'
import { IsNumber, IsOptional } from 'class-validator'

export class PaginationDto {
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  page?: number = 1

  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  limit?: number = 20
}
