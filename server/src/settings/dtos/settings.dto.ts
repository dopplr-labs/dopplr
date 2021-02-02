import { IsEnum, IsJSON, IsNumber, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { PartialType } from '@nestjs/mapped-types'
import { KeyBinding, LineNumber, WordWrap } from '../settings.types'

export class TextEditorSettingsDto {
  @IsEnum(LineNumber)
  lineNumbers: LineNumber

  @IsEnum(WordWrap)
  @IsString()
  wordWrap: WordWrap

  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  tabSize: number

  @IsString()
  fontFamily: string

  @IsString()
  fontWeight: string

  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  fontSize: number

  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsNumber()
  lineHeight: number

  @IsEnum(KeyBinding)
  keyBinding: KeyBinding

  @IsString()
  theme: string
}

export class TextEditorSettingsUpdateDto extends PartialType(
  TextEditorSettingsDto,
) {}

export class SettingsDto {
  @IsJSON()
  textEditorSettings: TextEditorSettingsDto
}
