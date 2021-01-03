import { createContext } from 'react'
import { BaseSettings } from 'types/settings'
import { DefaultTextEditorSettings } from 'components/settings/data/default-settings'

export type SettingsContextType = {
  textEditorSettings: BaseSettings
  onChangeTextEditorSettings: (
    key: string,
    value: string | number | boolean,
  ) => void
}

const SettingsContext = createContext<SettingsContextType>({
  textEditorSettings: DefaultTextEditorSettings,
  onChangeTextEditorSettings: () => {},
})

export default SettingsContext
