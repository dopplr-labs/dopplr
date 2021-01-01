import React, { ReactNode } from 'react'
import { BaseSettings } from 'types/settings'
import { Input, Select, Checkbox } from 'antd'
import { InputConfig, CheckboxConfig, SelectConfig, ConfigType } from '../types'

const { Option } = Select

type AppProp = {
  config: InputConfig | CheckboxConfig | SelectConfig
  settings: BaseSettings
  onChangeSettings: (key: string, value: boolean | string | number) => void
}

function renderContent(
  config: InputConfig | CheckboxConfig | SelectConfig,
  settings: BaseSettings,
  onChangeSettings: (key: string, value: boolean | string | number) => void,
): ReactNode | undefined {
  switch (config.type) {
    case ConfigType.InputConfig:
      return (
        <div className="space-y-1">
          <Input
            placeholder="Basic usage"
            defaultValue={config.default}
            value={settings[config.key] as string | number}
            onChange={(e) => onChangeSettings(config.key, e.target.value)}
          />
          <div className="text-xs text-content-tertiary">
            {config.description}
          </div>
        </div>
      )
    case ConfigType.SelectConfig:
      return (
        <div className="space-y-1">
          <Select
            className="w-full"
            defaultValue={config.default}
            value={settings[config.key] as string | number}
            onSelect={(value) => onChangeSettings(config.key, value)}
          >
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
          <Checkbox
            defaultChecked={config.default}
            checked={settings[config.key] as boolean}
            onChange={(e) => onChangeSettings(config.key, e.target.checked)}
          />
          <span className="ml-2 text-xs text-content-tertiary">
            {config.description}
          </span>
        </div>
      )
    default:
      return undefined
  }
}

export default function SettingsItem({
  config,
  settings,
  onChangeSettings,
}: AppProp) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-content-primary">
        {config.title}
      </label>
      {renderContent(config, settings, onChangeSettings)}
    </div>
  )
}
