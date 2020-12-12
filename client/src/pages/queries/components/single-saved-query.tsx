import React, { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { queryCache, useMutation } from 'react-query'
import { Dropdown, Menu, Modal } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
} from '@ant-design/icons'
import { SavedQuery, SavedQueryPage } from 'types/query'
import RenameQueryModal from './rename-query-modal'

import { deleteQuery } from '../queries-and-mutations'

type SavedQueryProps = {
  query: SavedQuery
}

export default function SingleSavedQuery({ query }: SavedQueryProps) {
  const [renameModalVisible, setRenameModalVisible] = useState(false)

  function handleModalRequestClose() {
    setRenameModalVisible(false)
  }

  const savedQueries: SavedQueryPage[] | undefined = queryCache.getQueryData([
    'saved-queries',
  ])

  const [deleteQueryMutation] = useMutation(deleteQuery, {
    onMutate: (deletedQueryId) => {
      queryCache.setQueryData(
        ['saved-queries'],
        // using page because saved queries are fetched using useinfiniteQuery
        savedQueries?.map((page) => ({
          ...page,
          items: page.items.filter((item) => item.id !== deletedQueryId),
        })),
      )
      queryCache.removeQueries(['saved-query', deletedQueryId])
    },
  })

  // Confirmation modal to appear when user tries to delete saved query
  const confirmDeleteSavedQuery = useCallback(() => {
    Modal.confirm({
      title: 'Delete Saved Query?',
      content: 'This action cannot be reverted',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteQueryMutation(query.id)
      },
    })
  }, [query.id, deleteQueryMutation])

  // Dropdown menu options for saved query
  const savedQueryMenu = useMemo(() => {
    return (
      <Menu>
        <Menu.Item
          key="0"
          className="flex items-center space-x-2 text-xs"
          onClick={() => {
            setRenameModalVisible(true)
          }}
        >
          <EditOutlined />
          <span>Rename</span>
        </Menu.Item>
        <Menu.Item
          key="1"
          className="flex items-center space-x-2 text-xs"
          onClick={confirmDeleteSavedQuery}
        >
          <DeleteOutlined />
          <span>Delete</span>
        </Menu.Item>
      </Menu>
    )
  }, [confirmDeleteSavedQuery])

  return (
    <>
      <Link
        to={`saved/${query.id}`}
        className="flex items-center justify-between px-3 py-2 text-xs cursor-pointer group hover:bg-gray-100"
        title={`${query.name}\n${query.query}`}
      >
        <div className="space-y-2 truncate">
          <div className="font-medium text-blue-500">
            <span>{query.name}</span>
          </div>
          <div className="truncate">{query.query}</div>
        </div>
        <span
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
          }}
        >
          <Dropdown overlay={savedQueryMenu} trigger={['click']}>
            <button className="invisible px-1 focus:outline-none group-hover:visible">
              <EllipsisOutlined className="text-lg" />
            </button>
          </Dropdown>
        </span>
      </Link>
      <RenameQueryModal
        visible={renameModalVisible}
        onRequestClose={handleModalRequestClose}
        queryId={query.id}
        queryName={query.name}
      />
    </>
  )
}
