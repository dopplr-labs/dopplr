import React from 'react'
import { Input, Select, Checkbox } from 'antd'
import {
  InputConfig,
  CheckboxConfig,
  SelectConfig,
  ConfigType,
} from '../settings-type'

const { Option } = Select

type AppProp = {
  config: InputConfig | CheckboxConfig | SelectConfig
}

function renderContent(config: InputConfig | CheckboxConfig | SelectConfig) {
  switch (config.type) {
    case ConfigType.InputConfig:
      return (
        <>
          <div className="text-sm">{config.description}</div>
          <Input placeholder="Basic usage" value={config.default} />
        </>
      )
    case ConfigType.SelectConfig:
      return (
        <>
          <div className="text-sm">{config.description}</div>
          <Select defaultValue={config.default}>
            {config.options.map((option) => (
              <Option value={option[1]}>{option[0]}</Option>
            ))}
          </Select>
        </>
      )
    case ConfigType.CheckboxConfig:
      return (
        <>
          <Checkbox checked={config.default}>{config.description}</Checkbox>
        </>
      )
    default:
      return undefined
  }
}

export default function SettingsCard({ config }: AppProp) {
  return (
    <div className="p-2 border-2 border-gray-300 hover:bg-gray-300">
      <div className="text-base">{config.title}</div>
      {renderContent(config)}
    </div>
  )
}
