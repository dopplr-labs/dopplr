import { ICommand } from 'react-ace'
import { KeyboardActions, keyMapMac, keyMapOthers } from 'utils/keyboard'

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
  [KeyboardActions.SAVE_QUERY]: (event) => {
    event?.preventDefault()
  },
  [KeyboardActions.RUN_QUERY]: (event) => {
    event?.preventDefault()
    document.getElementById('run-query')?.click()
  },
  [KeyboardActions.FORMAT_QUERY]: (event) => {
    event?.preventDefault()
    document.getElementById('format-query')?.click()
  },
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
