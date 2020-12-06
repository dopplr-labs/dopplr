import React, { useMemo, useState } from 'react'
import { Dropdown, Menu } from 'antd'
import {
  DeleteOutlined,
  EllipsisOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import { queryCache, useMutation } from 'react-query'
import { History } from 'types/history'
import { Link } from 'react-router-dom'
import { deleteQuery } from '../queries-and-mutations'
import SaveQueryModal from './save-query-modal'

type HistoryQueryProps = { query: History }

export default function HistoryQuery({ query }: HistoryQueryProps) {
  const [saveModalVisible, setSaveModalVisible] = useState(false)
  function handleModalRequestClose() {
    setSaveModalVisible(false)
  }

  const [deleteQueryMutation] = useMutation(deleteQuery, {
    onMutate: (deletedQueryId) => {
      queryCache.setQueryData(['history'], (history: History[] | undefined) =>
        history ? history.filter((data) => data.id !== deletedQueryId) : [],
      )
    },
  })

  const historyMenu = useMemo(() => {
    return (
      <Menu>
        <Menu.Item
          key="0"
          className="flex items-center space-x-2 text-xs"
          onClick={() => {
            setSaveModalVisible(true)
          }}
        >
          <SaveOutlined />
          <span>Save Query</span>
        </Menu.Item>
        <Menu.Item
          key="1"
          className="flex items-center space-x-2 text-xs"
          onClick={() => {
            deleteQueryMutation(query.id)
          }}
        >
          <DeleteOutlined />
          <span>Clear</span>
        </Menu.Item>
      </Menu>
    )
  }, [deleteQueryMutation, query.id])

  return (
    <>
      <Link
        className="flex items-center justify-between py-1 pl-8 pr-3 space-x-1 text-xs cursor-pointer hover:bg-gray-50 group"
        to={`/queries/history/${query.id}`}
      >
        <div className="w-full text-xs truncate" title={query.query}>
          {query.query}
        </div>
        <span
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
          }}
        >
          <Dropdown overlay={historyMenu} trigger={['click']}>
            <button className="invisible px-1 focus:outline-none group-hover:visible">
              <EllipsisOutlined className="text-lg" />
            </button>
          </Dropdown>
        </span>
      </Link>
      <SaveQueryModal
        visible={saveModalVisible}
        onRequestClose={handleModalRequestClose}
        resourceId={query.resource.id}
        query={query.query}
      />
    </>
  )
}
