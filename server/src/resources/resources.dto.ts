import { Transform } from 'class-transformer'
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator'
import { ClientType } from 'src/db-clients/client.interface'

export class CreateResourceDto {
  @IsString()
  name: string

  @IsEnum(ClientType)
  type: string

  @IsString()
  host: string

  @Transform(({ value }) => Number.parseInt(value, 10))
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
  @IsEnum(ClientType)
  type: string

  @IsOptional()
  @IsString()
  host: string

  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value, 10))
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
  @IsEnum(ClientType)
  type: string

  @IsString()
  host: string

  @Transform(({ value }) => Number.parseInt(value, 10))
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
