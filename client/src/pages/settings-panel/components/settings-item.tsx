import React, { useMemo } from 'react'
import { BaseSettings } from 'types/settings'
import { Input, Select, Checkbox, InputNumber } from 'antd'
import {
  InputConfig,
  CheckboxConfig,
  SelectConfig,
  ConfigType,
  SelectOption,
  SelectGroup,
} from '../types'

type SettingItemProps = {
  config: InputConfig | CheckboxConfig | SelectConfig
  settings: BaseSettings
  onChangeSettings: (key: string, value: boolean | string | number) => void
}

export default function SettingsItem({
  config,
  settings,
  onChangeSettings,
}: SettingItemProps) {
  const content = useMemo(() => {
    switch (config.type) {
      case ConfigType.INPUT: {
        if (typeof config.default === 'string') {
          return (
            <div className="space-y-1">
              <Input
                placeholder={config.title}
                defaultValue={config.default}
                value={settings[config.key] as string}
                onChange={(event) => {
                  onChangeSettings(config.key, event.target.value)
                }}
              />
              <div className="text-xs text-content-tertiary">
                {config.description}
              </div>
            </div>
          )
        }

        return (
          <div className="space-y-1">
            <InputNumber
              placeholder={config.title}
              defaultValue={config.default}
              value={settings[config.key] as number}
              onChange={(value) => {
                onChangeSettings(config.key, value as number)
              }}
              className="w-full"
            />
            <div className="text-xs text-content-tertiary">
              {config.description}
            </div>
          </div>
        )
      }

      case ConfigType.SELECT: {
        return (
          <div className="space-y-1">
            <Select
              className="w-full"
              defaultValue={config.default}
              value={settings[config.key] as string | number}
              onSelect={(value) => onChangeSettings(config.key, value)}
            >
              {config.options.map((option, idx) => {
                if ((option as SelectGroup).groupName) {
                  return (
                    <Select.OptGroup
                      label={(option as SelectGroup).groupName}
                      key={idx}
                    >
                      {(option as SelectGroup).options.map(
                        (innerOptions, innerIdx) => {
                          return (
                            <Select.Option
                              key={innerIdx}
                              value={innerOptions.value}
                            >
                              {innerOptions.key}
                            </Select.Option>
                          )
                        },
                      )}
                    </Select.OptGroup>
                  )
                }

                return (
                  <Select.Option
                    key={idx}
                    value={(option as SelectOption).value}
                  >
                    {(option as SelectOption).key}
                  </Select.Option>
                )
              })}
            </Select>
            <div className="text-xs text-content-tertiary">
              {config.description}
            </div>
          </div>
        )
      }

      case ConfigType.CHECKBOX: {
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
      }

      default: {
        return null
      }
    }
  }, [config, settings, onChangeSettings])

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-content-primary">
        {config.title}
      </label>
      {content}
    </div>
  )
}
