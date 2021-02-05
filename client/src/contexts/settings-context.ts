import { createContext } from 'react'

export type SettingsContextType = {
  textEditorSettings: Record<string, string | number | boolean>
  onChangeTextEditorSettings: (
    key: string,
    value: string | number | boolean,
  ) => void
}

const SettingsContext = createContext<SettingsContextType>({
  textEditorSettings: {},
  onChangeTextEditorSettings: () => {},
})

export default SettingsContext
