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
        name?: string
        data: Partial<UnsavedTabData>
      }
    | {
        id: string
        type: TabType.HISTORY
        name?: string
        data: Partial<HistoryTabData>
      }
    | {
        id: string
        type: TabType.SAVED_QUERY
        name?: string
        data: Partial<SavedQueryTabData>
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
          {
            id: newTabId,
            type: TabType.UNSAVED,
            data: { query: '' },
            name: 'Untitled Query',
          },
        ],
        activeTabId: newTabId,
      }
    }

    case ActionTypes.CLOSE_TAB: {
      const tabIndex = state.tabs.findIndex(
        (tab) => tab.id === action.payload.tabId,
      )
      if (tabIndex !== -1) {
        const nextTabIndex = tabIndex !== 0 ? tabIndex - 1 : tabIndex + 1
        return {
          tabs: state.tabs.filter((tab) => tab.id !== action.payload.tabId),
          activeTabId:
            state.activeTabId === action.payload.tabId
              ? state.tabs[nextTabIndex]?.id
              : state.activeTabId,
        }
      }
      return state
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
        tabs: [
          ...state.tabs,
          {
            id: newTabId,
            name:
              action.payload.type === TabType.HISTORY
                ? action.payload.data.query.slice(0, 10)
                : action.payload.data.name,
            ...action.payload,
          },
        ],
        activeTabId: newTabId,
      }
    }

    case ActionTypes.UPDATE_TAB: {
      return {
        ...state,
        tabs: state.tabs.map((tab) =>
          tab.id === action.payload.id
            ? ({
                ...tab,
                ...action.payload,
                data: { ...tab.data, ...action.payload.data },
              } as Tab)
            : tab,
        ),
      }
    }

    default: {
      return state
    }
  }
}
