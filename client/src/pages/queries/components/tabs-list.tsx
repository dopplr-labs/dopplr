import { Tabs } from 'antd'
import React, { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TabsContext from '../contexts/tabs-context'
import TabName from './tab-name'

const TabsLists = () => {
  const { tabs, removeTab } = useContext(TabsContext)
  const { tabType, id } = useParams()
  const navigate = useNavigate()

  return (
    <Tabs
      type="editable-card"
      className="flex-shrink-0 editors-tab"
      activeKey={`${tabType}/${id}`}
      onChange={(tabRoute) => {
        navigate(`/queries/${tabRoute}`)
      }}
      onEdit={(tabRoute, action) => {
        if (action === 'add') {
          navigate('/queries/new')
        } else if (typeof tabRoute === 'string' && action === 'remove') {
          removeTab(tabRoute)
        }
      }}
    >
      {tabs.map((tabRoute) => (
        <Tabs.TabPane key={tabRoute} tab={<TabName tabRoute={tabRoute} />} />
      ))}
    </Tabs>
  )
}

export default TabsLists
