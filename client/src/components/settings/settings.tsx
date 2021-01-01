import React, { useState } from 'react'
import SettingsContext from 'contexts/settings-context'
import { DefaultTextEditorSettings, DefaultWorkbenchSettings } from './default'

type Props = {
  children: React.ReactElement
}

export default function Settings({ children }: Props) {
  const [textEditorSettings, setTextEditorSettings] = useState({
    ...DefaultTextEditorSettings,
  })
  const [workbenchSettings, setWorkbenchSettings] = useState({
    ...DefaultWorkbenchSettings,
  })

  const onChangeTextEditorSettings = (
    key: string,
    value: string | number | boolean,
  ) => {
    setTextEditorSettings({
      ...textEditorSettings,
      [key]: value,
    })
  }

  const onChangeWorkbenchSettings = (
    key: string,
    value: string | number | boolean,
  ) => {
    setWorkbenchSettings({
      ...workbenchSettings,
      [key]: value,
    })
  }

  return (
    <SettingsContext.Provider
      value={{
        textEditorSettings,
        onChangeTextEditorSettings,
        workbenchSettings,
        onChangeWorkbenchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
