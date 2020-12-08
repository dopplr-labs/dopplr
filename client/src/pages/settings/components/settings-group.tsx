import React from 'react'
import SettingsSubgroup from './settings-subgroup'
import {Group} from '../settings-type'

type AppProps = {
  group: Group
}

export default function SettingsGroup({ group }: AppProps) {
  return (
    <>
      <div className="p-2 text-xl border-2 border-gray-300 hover:bg-gray-300">{group.title}</div>
      {group.subGroups.map((subGroup) => (
        <SettingsSubgroup subGroup={subGroup} />
      ))}
    </>
  )
}
