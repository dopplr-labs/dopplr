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

type SchemaTableProps = {
  table: SchemaResult
  resourceId: number
  defaultExpanded?: boolean
}

export default function SchemaTable({
  table,
  resourceId,
  defaultExpanded,
}: SchemaTableProps) {
  const [expanded, setExpanded] = useState(false)
  const [tableSampleVisible, setTableSampleVisible] = useState(false)

  function handleModalClose() {
    setTableSampleVisible(false)
  }

  const tableMenu = useMemo(() => {
    return (
      <Menu>
        <Menu.Item
          key="0"
          className="flex items-center space-x-2 text-xs"
          onClick={(event) => {
            event.domEvent.stopPropagation()
            setTableSampleVisible(true)
          }}
        >
          <TableOutlined />
          <span>View Sample</span>
        </Menu.Item>
      </Menu>
    )
  }, [])

  const showChildren = expanded || defaultExpanded

  return (
    <>
      <div>
        <div
          className="flex items-center px-3 py-1 space-x-1 font-mono text-xs font-bold truncate cursor-pointer text-brand-primary group hover:bg-brand-light hover:text-brand-primary"
          onClick={() => {
            setExpanded((prevState) => !prevState)
          }}
        >
          {showChildren ? (
            <DownOutlined className="text-xs" />
          ) : (
            <RightOutlined className="text-xs" />
          )}
          <span className="flex-1 truncate">{table.name}</span>
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
        {showChildren ? (
          <ul className="px-3 ml-4">
            {table.columns.map((column: ColumnsField) => (
              <li
                key={column.name}
                className="grid grid-cols-3 mb-2 font-mono text-xs"
              >
                <span className="col-span-2 truncate text-content-secondary">
                  {column.name}
                </span>
                <span className="col-span-1 text-right truncate text-content-tertiary">
                  {column.type}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <TableSample
        visible={tableSampleVisible}
        handleModalClose={handleModalClose}
        resourceId={resourceId}
        tableName={table.name}
      />
    </>
  )
}
