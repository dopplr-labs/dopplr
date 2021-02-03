import { ICommand } from 'react-ace'

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

export function saveQueryKeyboardActionHandler(event?: KeyboardEvent) {
  event?.preventDefault()
  document.getElementById('save-query-button')?.click()
}

export function runQueryKeyboardActionHandler(event?: KeyboardEvent) {
  event?.preventDefault()
  document.getElementById('run-query-button')?.click()
}

export function formatQueryKeyboardActionHandler(event?: KeyboardEvent) {
  event?.preventDefault()
  document.getElementById('format-query-button')?.click()
}

export const hotkeysHandler: {
  [key: string]: (keyEvent?: KeyboardEvent) => void
} = {
  [KeyboardActions.SAVE_QUERY]: saveQueryKeyboardActionHandler,
  [KeyboardActions.RUN_QUERY]: runQueryKeyboardActionHandler,
  [KeyboardActions.FORMAT_QUERY]: formatQueryKeyboardActionHandler,
}

export const aceCommands: ICommand[] = [
  {
    name: 'save-query',
    bindKey: {
      win: keyMapOthers[KeyboardActions.SAVE_QUERY],
      mac: keyMapMac[KeyboardActions.SAVE_QUERY],
    },
    exec: () => {
      saveQueryKeyboardActionHandler()
    },
  },
  {
    name: 'run-query',
    bindKey: {
      win: keyMapOthers[KeyboardActions.RUN_QUERY],
      mac: keyMapMac[KeyboardActions.RUN_QUERY],
    },
    exec: () => {
      runQueryKeyboardActionHandler()
    },
  },
  {
    name: 'format-query',
    bindKey: {
      win: keyMapOthers[KeyboardActions.FORMAT_QUERY],
      mac: keyMapMac[KeyboardActions.FORMAT_QUERY],
    },
    exec: () => {
      formatQueryKeyboardActionHandler()
    },
  },
]
