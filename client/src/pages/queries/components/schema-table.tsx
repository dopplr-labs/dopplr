import React, { useMemo, useState } from 'react'
import {
  DownOutlined,
  EllipsisOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { Dropdown, Menu } from 'antd'
import { ColumnsField, SchemaResult } from 'types/schema'
import TableSample from './table-sample'

export default function SchemaTable({
  table,
  resourceId,
}: {
  table: SchemaResult
  resourceId: number
}) {
  const [schema, setSchema] = useState({ ...table, isOpen: false })
  const [show, setShow] = useState(false)

  function handleModalClose() {
    setShow(false)
  }

  const tableMenu = useMemo(() => {
    return (
      <Menu>
        <Menu.Item
          key="0"
          onClick={(event) => {
            event.domEvent.stopPropagation()
            setShow(true)
          }}
        >
          View Sample
        </Menu.Item>
      </Menu>
    )
  }, [])

  return (
    <>
      <div>
        <div
          className="flex items-center justify-between px-3 py-2 font-mono text-xs font-bold text-blue-500 truncate cursor-pointer group hover:bg-blue-50 hover:text-blue-500"
          onClick={() => {
            setSchema((prevState) => ({
              ...prevState,
              isOpen: !prevState.isOpen,
            }))
          }}
        >
          <div className="space-x-1">
            {schema.isOpen ? (
              <DownOutlined className="text-xs" />
            ) : (
              <RightOutlined className="text-xs" />
            )}
            <span>{schema.table}</span>
          </div>
          <Dropdown overlay={tableMenu} trigger={['click']}>
            <button
              className="invisible px-1 group-hover:visible focus:outline-none"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <EllipsisOutlined className="text-lg" />
            </button>
          </Dropdown>
        </div>
        {schema.isOpen ? (
          <ul className="px-3 ml-4">
            {schema.columns.map((column: ColumnsField) => (
              <li
                key={column.column_name}
                className="grid grid-cols-3 space-y-1 font-mono text-xs"
              >
                <span className="col-span-2 text-gray-600 truncate">
                  {column.column_name}
                </span>
                <span className="col-span-1 text-right text-gray-400 truncate">
                  {column.data_type}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <TableSample
        visible={show}
        onCancel={handleModalClose}
        resourceId={resourceId}
        tableName={schema.table}
      />
    </>
  )
}
