import React, { useMemo, useState } from 'react'
import {
  DownOutlined,
  EllipsisOutlined,
  RightOutlined,
  TableOutlined,
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
          className="flex items-center space-x-2 text-xs"
          onClick={(event) => {
            event.domEvent.stopPropagation()
            setShow(true)
          }}
        >
          <TableOutlined />
          <span>View Sample</span>
        </Menu.Item>
      </Menu>
    )
  }, [])

  return (
    <>
      <div>
        <div
          className="flex items-center justify-between px-3 py-1 font-mono text-xs font-bold truncate cursor-pointer text-brand-primary group hover:bg-brand-light hover:text-brand-primary"
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
                className="grid grid-cols-3 mb-2 font-mono text-xs"
              >
                <span className="col-span-2 truncate text-content-secondary">
                  {column.column_name}
                </span>
                <span className="col-span-1 text-right truncate text-content-tertiary">
                  {column.data_type}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <TableSample
        visible={show}
        handleModalClose={handleModalClose}
        resourceId={resourceId}
        tableName={schema.table}
      />
    </>
  )
}
