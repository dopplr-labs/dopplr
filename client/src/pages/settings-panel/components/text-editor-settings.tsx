import React, { useContext } from 'react'
import SettingsContext from 'contexts/settings-context'
import { textEditorSettings as settings } from '../data/text-editor-settings'
import SettingsGroup from './settings-group'

export default function TextEditorSettings() {
  const subGroupDict = settings.subGroupDict
  const { textEditorSettings, onChangeTextEditorSettings } = useContext(
    SettingsContext,
  )

  return (
    <div className="space-y-8">
      {Object.keys(subGroupDict).map((subGroupKeys, idx) => (
        <SettingsGroup
          key={idx}
          subGroup={subGroupDict[subGroupKeys]}
          settings={textEditorSettings}
          onChangeSettings={onChangeTextEditorSettings}
        />
      ))}
    </div>
  )
}
