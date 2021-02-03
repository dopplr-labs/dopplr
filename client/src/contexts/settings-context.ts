import { createContext } from 'react'
import { DefaultTextEditorSettings } from 'components/settings/data/default-settings'

export type SettingsContextType = {
  textEditorSettings: typeof DefaultTextEditorSettings
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
