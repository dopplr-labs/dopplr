import React from 'react'
import { List } from 'antd'
import SettingsSubgroup from './settings-subgroup'
import {Group} from '../settings'

type AppProps = {
  groupData: Group
}

export default function SettingsGroup({ groupData }: AppProps) {
  return (
    <>
      <div className="p-2 text-xl border-2 border-gray-300 hover:bg-gray-300">{groupData.header}</div>
      {groupData.subGroups.map((item) => (
        <SettingsSubgroup subgroupData={item} />
      ))}
    </>
  )
}
