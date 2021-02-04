export type BaseSettings = {
  [key: string]: number | boolean | string
}

export enum KeyBinding {
  NONE = 'none',
  VIM = 'vim',
  EMACS = 'emacs',
  VSCODE = 'vscode',
}

export type TextEditorSettings = {
  lineNumbers: boolean
  wordWrap: boolean
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

export type Settings = {
  textEditorSettings: TextEditorSettings
}
