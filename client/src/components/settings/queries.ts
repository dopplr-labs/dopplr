import { Settings, TextEditorSettings } from 'types/settings'
import client from 'utils/client'

export async function fetchSettings(): Promise<Settings> {
  const { data } = await client.get<{ success: boolean; data: Settings }>(
    '/settings',
  )
  return data.data
}

export async function createSettings(
  defaultSettings: Settings,
): Promise<Settings> {
  const { data } = await client.post<{ success: boolean; data: Settings }>(
    '/settings',
    defaultSettings,
  )
  return data.data
}

export async function updateTextEditorSettings(
  textEditorSettings: Partial<TextEditorSettings>,
): Promise<TextEditorSettings> {
  const { data } = await client.patch<{ success: boolean; data: TextEditorSettings }>(
    '/settings/texteditorsettings',
    textEditorSettings,
  )
  return data.data
}
