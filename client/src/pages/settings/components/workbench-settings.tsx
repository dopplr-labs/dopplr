import React from 'react'
import { workbenchSettings as settings } from '../data/workbench-settings'
import SettingsGroup from './settings-group'

export default function TextEditorSettings() {
  const subGroupDict = settings.subGroupDict

  return (
    <>
      {Object.keys(subGroupDict).map((subGroupKeys, idx) => (
        <SettingsGroup key={idx} subGroup={subGroupDict[subGroupKeys]} />
      ))}
    </>
  )
}
