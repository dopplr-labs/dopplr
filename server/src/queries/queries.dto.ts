import { Transform } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { QueryResultFileType } from './query.types'

export class RunQueryDto {
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  resource: number

  @IsString()
  query: string
}

export class SaveQueryDto {
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  resource: number

  @IsString()
  name: string

  @IsString()
  query: string
}

export class UpdateQueryDto {
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  resource?: number

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  query?: string
}

export class SampleTableDto {
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  resource: number

  @IsString()
  tableName: string
}

export class DownloadQueryResultDto {
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  resource: number

  @IsString()
  query: string

  @IsEnum(QueryResultFileType)
  fileType: QueryResultFileType
}
