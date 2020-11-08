import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class RunQueryDto {
  @Transform(parseInt)
  @IsNumber()
  connection: number

  @IsOptional()
  @IsString()
  name?: string

  @IsString()
  query: string
}

export class SaveQueryDto {
  @Transform(parseInt)
  @IsNumber()
  connection: number

  @IsString()
  name: string

  @IsString()
  query: string
}

export class FilterHistoryDto {
  @Transform(parseInt)
  @IsNumber()
  connection: number
}
