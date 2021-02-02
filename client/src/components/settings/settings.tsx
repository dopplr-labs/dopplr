import React from 'react'
import SettingsContext from 'contexts/settings-context'
import usePersistedSetState from 'hooks/use-persisted-state'
import { DefaultTextEditorSettings } from './data/default-settings'

type SettingsProps = {
  children: React.ReactNode
}

export default function Settings({ children }: SettingsProps) {
  const [textEditorSettings, setTextEditorSettings] = usePersistedSetState(
    'user-settings',
    DefaultTextEditorSettings,
  )

  const onChangeTextEditorSettings = (
    key: string,
    value: string | number | boolean,
  ) => {
    setTextEditorSettings({
      ...textEditorSettings,
      [key]: value,
    })
  }

  return (
    <SettingsContext.Provider
      value={{
        textEditorSettings,
        onChangeTextEditorSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
