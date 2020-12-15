import React from 'react'
import { textEditorSettings as settings } from '../data/text-editor-settings'
import SettingsGroup from './settings-group'

export default function TextEditorSettings() {
  const subGroupDict = settings.subGroupDict

  return (
    <div className="space-y-6 xl:space-y-4 py-4 md:p-4">
      {Object.keys(subGroupDict).map((subGroupKeys, idx) => (
        <SettingsGroup key={idx} subGroup={subGroupDict[subGroupKeys]} />
      ))}
    </div>
  )
}
