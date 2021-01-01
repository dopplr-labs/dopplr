import { BaseSettings } from 'types/settings'

export const DefaultTextEditorSettings: BaseSettings = {
  // basic editor settings
  lineNumbers: 'on',
  lineHeight: 24,
  // font related settings
  fontFamily: 'JetBrains Mono',
  fontWeight: '300',
  fontSize: 16,
  fontLigatures: true,
  // cursor related settings
  cursorBlinking: 'blink',
  cursorSmoothCaretAnimation: false,
  cursorStyle: 'line',
  cursorSurroundingLines: 0,
  cursorSurroundingLinesStyle: 'default',
  cursorWidth: 2,
}

export const DefaultWorkbenchSettings: BaseSettings = {
  zenCenterLayout: true,
  zenFullScreen: true,
  zenHideLineNumber: true,
  zenHideTabs: true,
}
