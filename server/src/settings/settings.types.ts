export enum KeyBinding {
  NONE = 'none',
  VIM = 'vim',
  EMACS = 'emacs',
}

export type LineNumber = 'on' | 'off' | 'relative' | 'interval'
export type CursorBlinking = 'blink' | 'smooth' | 'phase' | 'expand' | 'solid'
export type WordWrap = 'off' | 'on' | 'wordWrapColumn' | 'bounded'

export type MinimapScale = 1 | 2 | 3
export type MiniMapShowSlider = 'always' | 'mouseover'
export type MiniMapSide = 'right' | 'left'
export type MiniMapSize = 'proportional' | 'fill' | 'fit'
export type CursorStyle =
  | 'line'
  | 'block'
  | 'underline'
  | 'line-thin'
  | 'block-outline'
  | 'underline-thin'
export type CursorSurroundingLinesStyle = 'default' | 'all'

export type TextEditorSettings = {
  lineNumbers: LineNumber
  wordWrap: WordWrap
  // font settings
  fontFamily: string
  fontWeight: string
  fontSize: number
  lineHeight: number
  fontLigatures: boolean
  cursorWidth: number
  // keybinding settings
  keyBinding: KeyBinding.NONE
  // theme settings
  theme: string
  //minimap settings
  minimapEnable: boolean
  minimapMaxColumn: number
  minimapRenderCharacters: boolean
  minimapScale: number
  minimapShowSlider: MiniMapShowSlider
  minimapSide: MiniMapSide
  minimapSize: MiniMapSize
  // cursor settings
  cursorBlinking: CursorBlinking
  cursorSmoothCaretAnimation: boolean
  cursorSurroundingLines: number
  cursorStyle: CursorStyle
  cursorSurroundingLinesStyle: CursorSurroundingLinesStyle
}
