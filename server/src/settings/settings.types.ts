export enum KeyBinding {
  NONE = 'none',
  VIM = 'vim',
  EMACS = 'emacs',
}

export enum LineNumber {
  ON = 'on',
  OFF = 'off',
  RELATIVE = 'relative',
  INTERVAL = 'interval',
}

export enum WordWrap {
  OFF = 'off',
  ON = 'on',
  WORD_WRAP_COLUMN = 'wordWrapColumn',
  BOUNDED = 'bounded',
}

export type TextEditorSettings = {
  lineNumbers: LineNumber
  wordWrap: WordWrap
  tabSize: number
  // font settings
  fontFamily: string
  fontWeight: number
  fontSize: number
  lineHeight: number
  // keybinding settings
  keyBinding: KeyBinding
  // theme settings
  theme: string
}
