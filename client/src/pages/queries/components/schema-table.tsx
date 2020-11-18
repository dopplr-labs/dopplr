import React, { useState } from 'react'
import { DownOutlined, RightOutlined } from '@ant-design/icons'
import { ColumnsField, SchemaResult } from 'types/schema'

export default function SchemaTable({ table }: { table: SchemaResult }) {
  const [schema, setSchema] = useState({ ...table, isOpen: false })

  return (
    <div>
      <div
        className="px-3 space-x-1 font-mono text-xs font-bold text-blue-500 truncate cursor-pointer"
        onClick={() => {
          setSchema((prevState) => ({
            ...prevState,
            isOpen: !prevState.isOpen,
          }))
        }}
      >
        {schema.isOpen ? (
          <DownOutlined className="text-xs" />
        ) : (
          <RightOutlined className="text-xs" />
        )}
        <span>{schema.table}</span>
      </div>
      {schema.isOpen ? (
        <ul className="px-3 ml-4">
          {schema.columns.map((column: ColumnsField) => (
            <li
              key={column.column_name}
              className="grid grid-cols-3 font-mono text-xs space-y-0.5"
            >
              <span className="col-span-2 text-gray-800 truncate">
                {column.column_name}
              </span>
              <span className="col-span-1 text-right truncate">
                {column.data_type}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
