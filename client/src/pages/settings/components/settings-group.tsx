import React from 'react'
import { List } from 'antd'
import SettingsCard from './settings-card'

type AppProps = {
  header: string
  data: object[]
}

export default function SettingsGroup({ header, data }: AppProps) {
  return (
    <List
      size="large"
      header={<div>{header}</div>}
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <SettingsCard />
        </List.Item>
      )}
    />
  )
}
