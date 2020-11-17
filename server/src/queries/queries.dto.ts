import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class RunQueryDto {
  @Transform(parseInt)
  @IsNumber()
  resource: number

  @IsOptional()
  @IsString()
  name?: string

  @IsString()
  query: string
}

export class SaveQueryDto {
  @Transform(parseInt)
  @IsNumber()
  resource: number

  @IsString()
  name: string

  @IsString()
  query: string
}

export class UpdateQueryDto {
  @IsOptional()
  @Transform(parseInt)
  @IsNumber()
  resource?: number

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  query?: string
}
