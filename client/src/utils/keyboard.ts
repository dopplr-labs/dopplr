export enum KeyboardActions {
  SAVE_QUERY_TAB = 'SAVE_QUERY_TAB',
  RUN_QUERY = 'RUN_QUERY',
  FORMAT_QUERY = 'FORMAT_QUERY',
}

export const isMac = window.navigator.platform.toLowerCase().startsWith('mac')

export const keyMapMac = {
  [KeyboardActions.SAVE_QUERY_TAB]: 'cmd+s',
  [KeyboardActions.RUN_QUERY]: 'cmd+enter',
  [KeyboardActions.FORMAT_QUERY]: 'cmd+b',
}

export const keyMapOthers = {
  [KeyboardActions.SAVE_QUERY_TAB]: 'ctrl+s',
  [KeyboardActions.RUN_QUERY]: 'ctrl+enter',
  [KeyboardActions.FORMAT_QUERY]: 'ctrl+b',
}

export const keyMap = isMac ? keyMapMac : keyMapOthers
