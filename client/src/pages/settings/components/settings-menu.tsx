import React from 'react'
import { Menu } from 'antd'
import { Group } from '../settings-type'

const { SubMenu } = Menu

type AppProps = {
  configGroups: Group[]
}

export default function SettingsMenu({ configGroups }: AppProps) {
  return (
    <Menu onClick={(e) => console.log(e)} mode="inline">
      {configGroups.map((group) => (
        <SubMenu key={group.title} title={group.title}>
          {group.subGroups.map((subGroup) => (
            <Menu.Item key={`${group.title}-${subGroup.title}`}>
              {subGroup.title}
            </Menu.Item>
          ))}
        </SubMenu>
      ))}
    </Menu>
  )
}
