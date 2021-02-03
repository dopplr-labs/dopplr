export enum KeyboardActions {
  SAVE_QUERY = 'SAVE_QUERY',
  RUN_QUERY = 'RUN_QUERY',
  FORMAT_QUERY = 'FORMAT_QUERY',
}

export const isMac = window.navigator.platform.toLowerCase().startsWith('mac')

export const keyMapMac = {
  [KeyboardActions.SAVE_QUERY]: 'cmd+s',
  [KeyboardActions.RUN_QUERY]: 'cmd+enter',
  [KeyboardActions.FORMAT_QUERY]: 'cmd+b',
}

export const keyMapOthers = {
  [KeyboardActions.SAVE_QUERY]: 'ctrl+s',
  [KeyboardActions.RUN_QUERY]: 'ctrl+enter',
  [KeyboardActions.FORMAT_QUERY]: 'ctrl+b',
}

export const keyMap = isMac ? keyMapMac : keyMapOthers
