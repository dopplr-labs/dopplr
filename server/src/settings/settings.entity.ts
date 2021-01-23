import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import {
  CursorBlinking,
  CursorStyle,
  CursorSurroundingLinesStyle,
  KeyBinding,
  LineNumber,
  MiniMapShowSlider,
  MiniMapSide,
  MiniMapSize,
  WordWrap,
} from './settings.types'

@Entity()
export class TextEditorSettings {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  lineNumbers: LineNumber

  @Column()
  wordWrap: WordWrap

  @Column()
  fontFamily: string

  @Column()
  fontWeight: string

  @Column()
  fontSize: number

  @Column()
  lineHeight: number

  @Column()
  fontLigatures: boolean

  @Column()
  cursorWidth: number

  @Column({ enum: KeyBinding })
  keyBinding: KeyBinding

  @Column()
  theme: string

  @Column()
  minimapEnable: boolean

  @Column()
  minimapMaxColumn: number

  @Column()
  minimapRenderCharacters: boolean

  @Column()
  minimapScale: number

  @Column()
  minimapShowSlider: MiniMapShowSlider

  @Column()
  minimapSide: MiniMapSide

  @Column()
  minimapSize: MiniMapSize

  @Column()
  cursorBlinking: CursorBlinking

  @Column()
  cursorSmoothCaretAnimation: boolean

  @Column()
  cursorSurroundingLines: number

  @Column()
  cursorStyle: CursorStyle

  @Column()
  cursorSurroundingLinesStyle: CursorSurroundingLinesStyle

  @Column()
  uid: string
}
