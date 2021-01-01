import React, { useContext } from 'react'
import SettingsContext from 'contexts/settings-context'
import { workbenchSettings as settings } from '../data/workbench-settings'
import SettingsGroup from './settings-group'

export default function TextEditorSettings() {
  const subGroupDict = settings.subGroupDict

  const { workbenchSettings, onChangeWorkbenchSettings } = useContext(
    SettingsContext,
  )

  return (
    <div className="space-y-8">
      {Object.keys(subGroupDict).map((subGroupKeys, idx) => (
        <SettingsGroup
          key={idx}
          subGroup={subGroupDict[subGroupKeys]}
          settings={workbenchSettings}
          onChangeSettings={onChangeWorkbenchSettings}
        />
      ))}
    </div>
  )
}
