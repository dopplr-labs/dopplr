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
        <div className="space-y-1">
          <Input placeholder="Basic usage" value={config.default} />
          <div className="text-xs text-content-tertiary">
            {config.description}
          </div>
        </div>
      )
    case ConfigType.SelectConfig:
      return (
        <div className="space-y-1">
          <Select className="w-full" defaultValue={config.default}>
            {config.options.map((option, idx) => (
              <Option key={idx} value={option[1]}>
                {option[0]}
              </Option>
            ))}
          </Select>
          <div className="text-xs text-content-tertiary">
            {config.description}
          </div>
        </div>
      )
    case ConfigType.CheckboxConfig:
      return (
        <div className="flex items-center">
          <Checkbox checked={config.default} />
          <span className="ml-2 text-xs text-content-tertiary">
            {config.description}
          </span>
        </div>
      )
    default:
      return undefined
  }
}

export default function SettingsCard({ config }: AppProp) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-content-primary">
        {config.title}
      </label>
      {renderContent(config)}
    </div>
  )
}
