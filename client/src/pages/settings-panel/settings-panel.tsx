import React from 'react'
import { SettingOutlined } from '@ant-design/icons'
import { Outlet } from 'react-router-dom'
import PageLayout from 'components/page-layout'
import PageSideBar from 'components/page-side-bar'
import PageSideBarLink from 'components/page-side-bar-link'

export default function SettingsPanel() {
  return (
    <PageLayout
      sidebar={
        <PageSideBar
          icon={<SettingOutlined className="text-lg" />}
          title="Settings"
          description="Update the settings of your Dopplr client"
          items={
            <>
              <PageSideBarLink to="text-editor">Text Editor</PageSideBarLink>
            </>
          }
        />
      }
      content={<Outlet />}
    />
  )
}
