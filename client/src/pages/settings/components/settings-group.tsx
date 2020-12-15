import React from 'react'
import { ToolOutlined } from '@ant-design/icons'
import { SubGroup } from 'types/settings'
import SettingsCard from './settings-card'

type AppProp = {
  subGroup: SubGroup
}

export default function SettingsGroup({ subGroup }: AppProp) {
  return (
      <div className="xl:grid xl:grid-cols-3 xl:gap-6">
        <div className="xl:col-span-1">
          <div className="px-4 md:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {subGroup.title}
            </h3>
            <div className="mt-1 text-sm text-gray-600">
              {subGroup.description}
            </div>
          </div>
        </div>
        <div className="mt-5 xl:mt-0 xl:col-span-2">
          <div className="shadow md:rounded-md md:overflow-hidden">
            <div className="px-4 py-5 bg-white space-y-6 md:p-6">
              {subGroup.configs.map((config, idx) => (
                <SettingsCard key={idx} config={config} />
              ))}
            </div>
          </div>
        </div>
      </div>
  )
}
