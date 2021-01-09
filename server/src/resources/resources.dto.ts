import {
  IsString,
  IsNumber,
  IsIn,
  IsOptional,
  IsBoolean,
} from 'class-validator'

export class CreateResourceDto {
  @IsString()
  name: string

  @IsIn(['postgres'])
  type: string

  @IsString()
  host: string

  @IsNumber()
  port: number

  @IsString()
  database: string

  @IsString()
  username: string

  @IsString()
  password: string

  @IsOptional()
  @IsBoolean()
  sslRequired?: boolean

  @IsOptional()
  @IsBoolean()
  selfCertificate?: boolean

  @IsOptional()
  @IsString()
  clientKey?: string

  @IsOptional()
  @IsString()
  clientCertificate?: string
}
export class UpdateResourceDto {
  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsIn(['postgres'])
  type: string

  @IsOptional()
  @IsString()
  host: string

  @IsOptional()
  @IsNumber()
  port: number

  @IsOptional()
  @IsString()
  database: string

  @IsOptional()
  @IsString()
  username: string

  @IsOptional()
  @IsString()
  password: string

  @IsOptional()
  @IsBoolean()
  sslRequired?: boolean

  @IsOptional()
  @IsBoolean()
  selfCertificate?: boolean

  @IsOptional()
  @IsString()
  clientKey?: string

  @IsOptional()
  @IsString()
  clientCertificate?: string
}

export class TestResourceDto {
  @IsIn(['postgres'])
  type: string

  @IsString()
  host: string

  @IsNumber()
  port: number

  @IsString()
  database: string

  @IsString()
  username: string

  @IsString()
  password: string

  @IsOptional()
  @IsBoolean()
  sslRequired?: boolean

  @IsOptional()
  @IsBoolean()
  selfCertificate?: boolean

  @IsOptional()
  @IsString()
  clientKey?: string

  @IsOptional()
  @IsString()
  clientCertificate?: string
}
