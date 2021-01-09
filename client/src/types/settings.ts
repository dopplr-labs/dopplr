export type BaseSettings = {
  [key: string]: number | boolean | string
}

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
