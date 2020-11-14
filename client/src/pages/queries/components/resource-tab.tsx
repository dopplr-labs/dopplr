import React from 'react'
import Axios from 'axios'
import { SearchOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { useQuery } from 'react-query'
import { range } from 'lodash-es'

export default function ResourceTab({ resourceId }: { resourceId: number }) {
  async function fetchSchema(id: number) {
    const { data } = await Axios.post(
      `http://localhost:3001/resources/schema/${id}`,
    )
    return data.data
  }

  const { isLoading, data: schema } = useQuery(['schema', resourceId], () =>
    fetchSchema(resourceId),
  )

  return (
    <>
      <Input
        placeholder="Search Tables and Columns"
        prefix={<SearchOutlined />}
      />
      <div className="my-4 space-y-4">
        {isLoading
          ? range(10).map((val) => (
              <div
                key={val}
                className="w-full h-4 bg-gray-200 rounded animate-pulse"
                style={{ opacity: 1 - val / 10 }}
              />
            ))
          : schema?.map((table: any) => (
              <div key={table.table}>
                <div className="font-bold truncate">{table.table}</div>
                <ul>
                  {table.columns.map((column: any) => (
                    <li key={column.column_name} className="grid grid-cols-3">
                      <span className="col-span-2 truncate">
                        {column.column_name}
                      </span>
                      <span className="col-span-1 italic truncate">
                        {column.data_type}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
      </div>
    </>
  )
}
