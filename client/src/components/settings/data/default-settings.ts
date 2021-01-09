import { BaseSettings, KeyBinding } from 'types/settings'

export const DefaultTextEditorSettings: BaseSettings = Object.freeze({
  // basic editor settings
  lineNumbers: 'on',
  wordWrap: 'off',
  // font settings
  fontFamily: 'JetBrains Mono',
  fontWeight: '300',
  fontSize: 12,
  lineHeight: 20,
  fontLigatures: true,
  cursorWidth: 2,
  // keybinding settings
  keyBinding: KeyBinding.NONE,
  // theme settings
  theme: 'default',
  //minimap settings
  minimapEnable: true,
  minimapMaxColumn: 120,
  minimapRenderCharacters: false,
  minimapScale: 1,
  minimapShowSlider: 'mouseover',
  minimapSide: 'right',
  minimapSize: 'proportional',
  // cursor settings
  cursorBlinking: 'blink',
  cursorSmoothCaretAnimation: false,
  cursorStyle: 'line',
  cursorSurroundingLines: 0,
  cursorSurroundingLinesStyle: 'default',
})
