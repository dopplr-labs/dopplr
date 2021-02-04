import React, { useState } from 'react'
import { Spin } from 'antd'
import SettingsContext from 'contexts/settings-context'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Settings as SettingsType } from 'types/settings'
import {
  createSettings,
  fetchSettings,
  updateTextEditorSettings,
} from './queries'
import { DefaultTextEditorSettings } from './data/default-settings'

type SettingsProps = {
  children: React.ReactNode
}

export default function Settings({ children }: SettingsProps) {
  const queryClient = useQueryClient()

  const [textEditorSettings, setTextEditorSettings] = useState(
    DefaultTextEditorSettings,
  )

  const { mutate: changeTextEditorSettings } = useMutation(
    updateTextEditorSettings,
    {
      onMutate: (args) => {
        setTextEditorSettings({
          ...textEditorSettings,
          // [key]: value,
          ...args,
        })
      },
    },
  )

  const { isLoading } = useQuery<SettingsType>('settings', fetchSettings, {
    onSuccess: (data) => {
      setTextEditorSettings(data.textEditorSettings)
    },
    onError: (error: any) => {
      if (error) {
        createSettings({
          textEditorSettings: DefaultTextEditorSettings,
        }).then((data) => {
          queryClient.setQueryData('settings', data)
        })
      }
    },
  })

  const onChangeTextEditorSettings = (
    key: string,
    value: string | number | boolean,
  ) => {
    changeTextEditorSettings({
      [key]: value,
    })
  }

  return isLoading ? (
    <div className="flex items-center justify-center w-screen h-screen">
      <Spin tip="Loading..." />
    </div>
  ) : (
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
