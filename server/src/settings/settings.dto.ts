import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator'
import { CursorBlinking, CursorStyle, CursorSurroundingLinesStyle, KeyBinding, LineNumber, MiniMapShowSlider, MiniMapSide, MiniMapSize, WordWrap } from './settings.types'
import { PartialType } from '@nestjs/mapped-types';

export class TextEditorSettingsDto {
  @IsString()
  lineNumbers: LineNumber

  @IsString()
  wordWrap: WordWrap
 
  @IsString()
  fontFamily: string

  @IsString()
  fontWeight: string

  @IsNumber()
  fontSize: number

  @IsNumber()
  lineHeight: number

  @IsBoolean()
  fontLigatures: boolean

  @IsNumber()
  cursorWidth: number
  
  @IsEnum(KeyBinding)
  keyBinding: KeyBinding
  
  @IsString()
  theme: string
  
  @IsBoolean()
  minimapEnable: boolean

  @IsNumber()
  minimapMaxColumn: number

  @IsBoolean()
  minimapRenderCharacters: boolean

  @IsNumber()
  minimapScale: number

  @IsString()
  minimapShowSlider: MiniMapShowSlider

  @IsString()
  minimapSide: MiniMapSide

  @IsString()
  minimapSize: MiniMapSize
  
  @IsString()
  cursorBlinking: CursorBlinking

  @IsBoolean()
  cursorSmoothCaretAnimation: boolean

  @IsNumber()
  cursorSurroundingLines: number

  @IsString()
  cursorStyle: CursorStyle

  @IsString()
  cursorSurroundingLinesStyle: CursorSurroundingLinesStyle
}

export class TextEditorSettingsUpdateDto extends PartialType(TextEditorSettingsDto) {}
