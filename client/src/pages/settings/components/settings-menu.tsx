import React, { useState } from 'react'
import { Menu } from 'antd'
import { CreditCardOutlined, AppstoreOutlined } from '@ant-design/icons'

const { SubMenu } = Menu

export default function SettingsMenu() {
  const [current, setCurrent] = useState()

  return (
    <Menu onClick={(e) => console.log(e)} mode="inline">
      <SubMenu key="1" icon={<CreditCardOutlined />} title="Text Editor">
        <Menu.Item key="1.1">Cursor</Menu.Item>
        <Menu.Item key="1.2">Font</Menu.Item>
        <Menu.Item key="1.3">Minimap</Menu.Item>
      </SubMenu>
      <SubMenu key="2" icon={<AppstoreOutlined />} title="Work Bench">
        <Menu.Item key="2.1">Zen Mode</Menu.Item>
      </SubMenu>
    </Menu>
  )
}
