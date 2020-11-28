import React from 'react'
import { Input } from 'antd'
import { ConfigType } from '../settings'
import { Config } from '../settings'

type AppProp = {
  configData: Config
}

function renderInput(type: ConfigType) {
  switch (type) {
    case ConfigType.Input:
      return <Input placeholder="Basic usage" />
    default:
      return undefined
  }
}

export default function SettingsCard({ configData }: AppProp) {
  return (
    <div className="p-2 border-2 border-gray-300 hover:bg-gray-300">
      <div className="text-base">{configData.header}</div>
      <div className="text-sm">{configData.description}</div>
      {renderInput(configData.type)}
    </div>
  )
}
