import React, { useMemo, useState } from 'react'
import { matchSorter } from 'match-sorter'
import { SearchOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { useQuery } from 'react-query'
import { range } from 'lodash-es'
import Scrollbars from 'react-custom-scrollbars'
import { ColumnsField } from 'types/schema'
import { fetchSchema } from '../queries-and-mutations'
import SchemaTable from './schema-table'

export default function SchemaTab({ resourceId }: { resourceId: number }) {
  const { isLoading, data: schema } = useQuery(['schema', resourceId], () =>
    fetchSchema(resourceId),
  )

  const [input, setInput] = useState('')

  const filteredSchema = useMemo(() => {
    if (schema) {
      return matchSorter(schema, input, {
        keys: [
          (table) => table.columns.map((i: ColumnsField) => i.column_name),
        ],
      })
    }
  }, [input, schema])

  return (
    <div className="flex flex-col h-full">
      <div className="mx-3 mb-4">
        <Input
          placeholder="Search Tables and Columns"
          prefix={<SearchOutlined />}
          value={input}
          onChange={({ target: { value } }) => {
            setInput(value)
          }}
        />
      </div>
      <Scrollbars className="h-full" autoHide>
        <div>
          {isLoading ? (
            <div className="px-3 space-y-4">
              {range(10).map((val) => (
                <div
                  key={val}
                  className="w-full h-4 bg-gray-200 rounded animate-pulse"
                  style={{ opacity: 1 - val / 10 }}
                />
              ))}
            </div>
          ) : (
            <div className="">
              {filteredSchema?.map((table: any) => (
                <SchemaTable
                  key={table.table}
                  table={table}
                  resourceId={resourceId}
                />
              ))}
            </div>
          )}
        </div>
      </Scrollbars>
    </div>
  )
}
