import { BaseSettings } from 'types/settings'

export const DefaultTextEditorSettings: BaseSettings = Object.freeze({
  // basic editor settings
  lineNumbers: 'on',
  wordWrap: 'off',
  // font related settings
  fontFamily: 'JetBrains Mono',
  fontWeight: '300',
  fontSize: 12,
  lineHeight: 20,
  fontLigatures: true,
  // cursor related settings
  cursorBlinking: 'blink',
  cursorSmoothCaretAnimation: false,
  cursorStyle: 'line',
  cursorSurroundingLines: 0,
  cursorSurroundingLinesStyle: 'default',
  cursorWidth: 2,
})
