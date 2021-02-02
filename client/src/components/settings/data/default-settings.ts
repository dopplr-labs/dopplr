import { KeyBinding } from 'types/settings'

export const DefaultTextEditorSettings = Object.freeze({
  // basic editor settings
  lineNumbers: true,
  wordWrap: false,
  // font settings
  fontFamily: 'JetBrains Mono',
  fontWeight: 300,
  fontSize: 12,
  lineHeight: 20,
  cursorWidth: 2,
  // keybinding settings
  keyBinding: KeyBinding.NONE,
  // theme settings
  theme: 'github',
})
