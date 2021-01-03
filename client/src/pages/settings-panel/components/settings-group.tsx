import React from 'react'
import { BaseSettings } from 'types/settings'
import { SubGroup } from '../types'
import SettingsItem from './settings-item'

type AppProp = {
  subGroup: SubGroup
  settings: BaseSettings
  onChangeSettings: (key: string, value: boolean | string | number) => void
}

export default function SettingsGroup({
  subGroup,
  settings,
  onChangeSettings,
}: AppProp) {
  return (
    <div className="overflow-hidden border rounded-md">
      <div className="px-6 py-3 border-b bg-background-primary">
        <h3 className="text-base font-medium text-content-primary">
          {subGroup.title}
        </h3>
        <div className="text-sm text-content-secondary">
          {subGroup.description}
        </div>
      </div>
      <div className="px-6 py-3 space-y-8 bg-white">
        {subGroup.configs.map((config, idx) => (
          <SettingsItem
            key={idx}
            config={config}
            settings={settings}
            onChangeSettings={onChangeSettings}
          />
        ))}
      </div>
    </div>
  )
}
