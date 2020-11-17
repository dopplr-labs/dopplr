import { Transform } from 'class-transformer'
import { IsNumber, IsOptional } from 'class-validator'

export class PaginationDto {
  @IsOptional()
  @Transform(parseInt)
  @IsNumber()
  page?: number = 1

  @IsOptional()
  @Transform(parseInt)
  @IsNumber()
  limit?: number = 20
}
