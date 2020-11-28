import {
  HistoryTabData,
  SavedQueryTabData,
  Tab,
  TabType,
  UnsavedTabData,
} from 'types/tab'

export type State = {
  tabs: Tab[]
  activeTabId?: string
}

export enum ActionTypes {
  CREATE_NEW_TAB = 'CREATE_NEW_TAB',
  OPEN_IN_TAB = 'OPEN_IN_TAB',
  CLOSE_TAB = 'CLOSE_TAB',
  UPDATE_TAB = 'UPDATE_TAB',
  FOCUS_TAB = 'FOCUS_TAB',
}

export type CreateNewTab = {
  type: ActionTypes.CREATE_NEW_TAB
}

export type OpenInTab = {
  type: ActionTypes.OPEN_IN_TAB
  payload:
    | {
        type: TabType.HISTORY
        data: HistoryTabData
      }
    | {
        type: TabType.SAVED_QUERY
        data: SavedQueryTabData
      }
}

export type CloseTab = {
  type: ActionTypes.CLOSE_TAB
  payload: {
    tabId: string
  }
}

export type UpdateTab = {
  type: ActionTypes.UPDATE_TAB
  payload:
    | {
        id: string
        type: TabType.UNSAVED
        data: UnsavedTabData
      }
    | {
        id: string
        type: TabType.HISTORY
        data: HistoryTabData
      }
    | {
        id: string
        type: TabType.SAVED_QUERY
        data: SavedQueryTabData
      }
}

export type FocusTab = {
  type: ActionTypes.FOCUS_TAB
  payload: {
    tabId: string
  }
}

export type Action = CreateNewTab | OpenInTab | CloseTab | UpdateTab | FocusTab

function uid() {
  return Date.now().toString(36)
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionTypes.CREATE_NEW_TAB: {
      const newTabId = uid()
      return {
        tabs: [
          ...state.tabs,
          { id: newTabId, type: TabType.UNSAVED, data: { query: '' } },
        ],
        activeTabId: newTabId,
      }
    }

    case ActionTypes.CLOSE_TAB: {
      return {
        tabs: state.tabs.filter((tab) => tab.id !== action.payload.tabId),
        activeTabId:
          state.activeTabId === action.payload.tabId
            ? state.tabs[state.tabs.length - 1]?.id
            : state.activeTabId,
      }
    }

    case ActionTypes.FOCUS_TAB: {
      return {
        ...state,
        activeTabId: action.payload.tabId,
      }
    }

    case ActionTypes.OPEN_IN_TAB: {
      const newTabId = uid()
      return {
        tabs: [...state.tabs, { id: newTabId, ...action.payload }],
        activeTabId: newTabId,
      }
    }

    case ActionTypes.UPDATE_TAB: {
      return {
        ...state,
        tabs: state.tabs.map((tab) =>
          tab.id === action.payload.id ? action.payload : tab,
        ),
      }
    }

    default: {
      return state
    }
  }
}
