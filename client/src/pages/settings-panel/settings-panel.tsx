import React from 'react'
import { SettingOutlined } from '@ant-design/icons'
import { Outlet } from 'react-router-dom'
import PageLayout from 'components/page-layout'
import PageSideBar from 'components/page-side-bar'
import PageSideBarLink from 'components/page-side-bar-link'
import PreviewBar from './components/preview-bar'

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
              <PageSideBarLink to="workbench">Workbench</PageSideBarLink>
            </>
          }
        />
      }
      content={
        <div
          className="flex"
          style={{ margin: '-2rem', height: 'calc(100vh - 3rem)' }}
        >
          <div className="max-w-3xl p-8 overflow-y-auto">
            <Outlet />
          </div>
          <div className="flex-1 border-l w-96">
            <PreviewBar />
          </div>
        </div>
      }
    />
  )
}
