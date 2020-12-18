import React from 'react'
import { SubGroup } from 'types/settings'
import SettingsCard from './settings-card'

type AppProp = {
  subGroup: SubGroup
}

export default function SettingsGroup({ subGroup }: AppProp) {
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
          <SettingsCard key={idx} config={config} />
        ))}
      </div>
    </div>
  )
}
