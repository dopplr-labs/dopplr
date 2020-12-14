import React from 'react'
import { ToolOutlined } from '@ant-design/icons'
import { SubGroup } from 'types/settings'
import SettingsCard from './settings-card'

type AppProp = {
  subGroup: SubGroup
}

export default function SettingsGroup({subGroup}: AppProp) {
  return (
    <>
      <div className="text-2xl text-black text-bold mb-4 mt-2 ml-4">
        <span className="mr-2">
          <ToolOutlined />
        </span>
        {subGroup.title}
      </div>
      {subGroup.configs.map((config, idx) => (
        <SettingsCard key={idx} config={config} />
      ))}
    </>
  )
}
