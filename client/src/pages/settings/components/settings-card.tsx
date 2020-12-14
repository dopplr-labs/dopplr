import React from 'react'
import { Input, Select, Checkbox } from 'antd'
import {
  InputConfig,
  CheckboxConfig,
  SelectConfig,
  ConfigType,
} from 'types/settings'

const { Option } = Select

type AppProp = {
  config: InputConfig | CheckboxConfig | SelectConfig
}

function renderContent(config: InputConfig | CheckboxConfig | SelectConfig) {
  switch (config.type) {
    case ConfigType.InputConfig:
      return (
        <>
          <div className="text-sm text-gray-500">{config.description}</div>
          <Input placeholder="Basic usage" value={config.default} />
        </>
      )
    case ConfigType.SelectConfig:
      return (
        <>
          <div className="text-sm text-gray-500">{config.description}</div>
          <Select defaultValue={config.default}>
            {config.options.map((option, idx) => (
              <Option key={idx} value={option[1]}>
                {option[0]}
              </Option>
            ))}
          </Select>
        </>
      )
    case ConfigType.CheckboxConfig:
      return (
        <div className="flex">
          <Checkbox checked={config.default} />
          <span className="text-gray-500 ml-2">{config.description}</span>
        </div>
      )
    default:
      return undefined
  }
}

export default function SettingsCard({ config }: AppProp) {
  return (
    <div className="p-2 ml-2 w-2/3">
      <div className="text-black">{config.title}</div>
      {renderContent(config)}
    </div>
  )
}
