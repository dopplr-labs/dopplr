import React, { useState } from 'react'
import { Input } from 'antd'
import SettingsMenu from './components/settings-menu'
import SettingsGroup from './components/settings-group'

const { Search } = Input

const onSearch = (value: string): void => console.log(value)

export enum ConfigType {
  Input = 1,
  Dropdown,
  Checkbox,
}

export type Config = { type: ConfigType; header: string; description: string }

export type SubGroup = {
  header: string
  configs: Config[]
}

export type Group = {
  header: string
  subGroups: SubGroup[]
}

const groups: Group[] = [
  {
    header: 'Text Editor',
    subGroups: [
      {
        header: 'Cursor',
        configs: [
          {
            type: ConfigType.Input,
            header: 'Cursor Blinking',
            description: 'Control the cursor animation style',
          },
        ],
      },
      {
        header: 'Font',
        configs: [
          {
            type: ConfigType.Input,
            header: 'Cursor Blinking',
            description: 'Control the cursor animation style',
          },
        ],
      },
      {
        header: 'Minimap',
        configs: [
          {
            type: ConfigType.Input,
            header: 'Cursor Blinking',
            description: 'Control the cursor animation style',
          },
        ],
      },
    ],
  },
  {
    header: 'Work Bench',
    subGroups: [
      {
        header: 'Zen Mode',
        configs: [
          {
            type: ConfigType.Input,
            header: 'Cursor Blinking',
            description: 'Control the cursor animation style',
          },
        ],
      },
    ],
  },
]

export default function Settings() {
  return (
    <div className="flex flex-1 h-full justify-center bg-gray-200">
      <div className="flex flex-col xl:w-1/2 w-96 my-4 shadow-lg bg-white">
        <div className="mx-2 mt-2">
          <Search
            placeholder="input search text"
            onSearch={onSearch}
            enterButton
          />
        </div>
        <div className="flex flex-1 m-2">
          <div className="w-56 mr-2 overflow-y-auto hidden xl:block">
            <SettingsMenu />
          </div>
          <div className="flex-1 overflow-y-auto">
            {groups.map((item) => (
              <SettingsGroup groupData={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
