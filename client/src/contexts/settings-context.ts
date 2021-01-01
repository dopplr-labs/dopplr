import { createContext } from 'react'
import { BaseSettings } from 'types/settings'
import {
  DefaultTextEditorSettings,
  DefaultWorkbenchSettings,
} from 'components/settings/default'

export type SettingsContextType = {
  textEditorSettings: BaseSettings
  onChangeTextEditorSettings: (
    key: string,
    value: string | number | boolean,
  ) => void
  workbenchSettings: BaseSettings
  onChangeWorkbenchSettings: (
    key: string,
    value: string | number | boolean,
  ) => void
}

const SettingsContext = createContext<SettingsContextType>({
  textEditorSettings: DefaultTextEditorSettings,
  onChangeTextEditorSettings: () => {},
  workbenchSettings: DefaultWorkbenchSettings,
  onChangeWorkbenchSettings: () => {},
})

export default SettingsContext
