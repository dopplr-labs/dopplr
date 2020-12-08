import React from 'react'
import SettingsCard from './settings-card'
import { SubGroup } from '../settings-type'

type AppProps = {
  subGroup: SubGroup
}

export default function SettingsSubgroup({ subGroup }: AppProps) {
  return (
    <>
      <div className="p-2 text-lg border-2 border-gray-300 hover:bg-gray-300">
        {subGroup.title}
      </div>
      {subGroup.configs.map((config) => (
        <SettingsCard config={config} />
      ))}
    </>
  )
}
