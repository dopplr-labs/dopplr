import React from 'react'
import SettingsCard from './settings-card'
import { SubGroup } from '../settings'

type AppProps = {
  subgroupData: SubGroup
}

export default function SettingsSubgroup({ subgroupData }: AppProps) {
  console.log(subgroupData)

  return (
    <>
      <div className="p-2 text-lg border-2 border-gray-300 hover:bg-gray-300">
        {subgroupData.header}
      </div>
      {subgroupData.configs.map((item) => (
        <SettingsCard configData={item} />
      ))}
    </>
  )
}
