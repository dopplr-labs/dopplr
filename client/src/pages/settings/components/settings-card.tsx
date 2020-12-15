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
        <div className="grid grid-cols-3 gap-6 mt-1">
          <div className="col-span-3 lg:col-span-2">
            <Input placeholder="Basic usage" value={config.default} />
            <p className="mt-2 text-sm text-gray-500">{config.description}</p>
          </div>
        </div>
      )
    case ConfigType.SelectConfig:
      return (
        <div className="mt-1">
          <Select className="w-64" defaultValue={config.default}>
            {config.options.map((option, idx) => (
              <Option key={idx} value={option[1]}>
                {option[0]}
              </Option>
            ))}
          </Select>
          <p className="mt-2 text-sm text-gray-500">{config.description}</p>
        </div>
      )
    case ConfigType.CheckboxConfig:
      return (
        <div className="flex mt-1">
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
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {config.title}
      </label>
      {renderContent(config)}
    </div>
  )
}
