import React from 'react'
import { message, Spin } from 'antd'
import SettingsContext from 'contexts/settings-context'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Settings as SettingsType, TextEditorSettings } from 'types/settings'
import { merge } from 'lodash-es'
import {
  createSettings,
  fetchSettings,
  updateTextEditorSettings,
} from './queries'

type SettingsProps = {
  children: React.ReactNode
}

export default function Settings({ children }: SettingsProps) {
  const queryClient = useQueryClient()

  const { data } = useQuery<SettingsType>('settings', fetchSettings, {
    onError: (error: any) => {
      if (error) {
        createSettings().then((data) => {
          queryClient.setQueryData('settings', data)
        })
      }
    },
    refetchOnWindowFocus: false,
    retry: false,
  })

  const { mutate: changeTextEditorSettings } = useMutation(
    updateTextEditorSettings,
    {
      onMutate: (updatedTextEditorSettings: Partial<TextEditorSettings>) => {
        const prevSettings = queryClient.getQueryData('settings')
        queryClient.setQueryData(
          'settings',
          merge({}, prevSettings, {
            textEditorSettings: updatedTextEditorSettings,
          }),
        )
        return { prevSettings }
      },
      onError: (error: any, variables, context) => {
        if (error) {
          message.error(
            error?.response?.data?.message ?? 'Something went wrong',
          )
          queryClient.setQueryData('settings', context?.prevSettings)
        }
      },
    },
  )

  const onChangeTextEditorSettings = (
    key: string,
    value: string | number | boolean,
  ) => {
    changeTextEditorSettings({
      [key]: value,
    })
  }

  if (data?.textEditorSettings) {
    return (
      <SettingsContext.Provider
        value={{
          textEditorSettings: data.textEditorSettings,
          onChangeTextEditorSettings,
        }}
      >
        {children}
      </SettingsContext.Provider>
    )
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <Spin tip="Loading Settings..." />
    </div>
  )
}
