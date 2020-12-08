import React from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { Input } from 'antd'
import SettingsMenu from './components/settings-menu'
import SettingsGroup from './components/settings-group'
import { dummyData as ConfigGroups } from './settings-type'

const { Search } = Input

const onSearch = (value: string): void => console.log(value)

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
          <div className="w-56 mr-2 overflow-hidden hidden xl:block">
            <Scrollbars className="h-full" autoHide universal>
              <SettingsMenu configGroups={ConfigGroups} />
            </Scrollbars>
          </div>
          <div className="flex-1 overflow-hidden">
            <Scrollbars className="h-full" autoHide universal>
              {ConfigGroups.map((group) => (
                <SettingsGroup group={group} />
              ))}
            </Scrollbars>
          </div>
        </div>
      </div>
    </div>
  )
}
