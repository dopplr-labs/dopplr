export type BaseSettings = {
  [key: string]: number | boolean | string
}

export type LineNumber = 'on' | 'off' | 'relative' | 'interval'
export type CursorBlinking = 'blink' | 'smooth' | 'phase' | 'expand' | 'solid'
export type WordWrap = 'off' | 'on' | 'wordWrapColumn' | 'bounded'
