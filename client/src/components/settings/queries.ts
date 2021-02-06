import { Settings, TextEditorSettings } from 'types/settings'
import client from 'utils/client'

export async function fetchSettings(): Promise<Settings> {
  const { data } = await client.get<{ success: boolean; data: Settings }>(
    '/settings',
  )
  return data.data
}

export async function createSettings(): Promise<Settings> {
  const { data } = await client.post<{ success: boolean; data: Settings }>(
    '/settings',
  )
  return data.data
}

export async function updateTextEditorSettings(
  textEditorSettings: Partial<TextEditorSettings>,
): Promise<TextEditorSettings> {
  const { data } = await client.patch<{
    success: boolean
    data: TextEditorSettings
  }>('/settings/text-editor', textEditorSettings)
  return data.data
}
