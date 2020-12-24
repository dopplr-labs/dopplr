import React, { useMemo, useState } from 'react'
import { matchSorter } from 'match-sorter'
import { SearchOutlined } from '@ant-design/icons'
import { Input, Result } from 'antd'
import { useQuery } from 'react-query'
import { range } from 'lodash-es'
import Scrollbars from 'react-custom-scrollbars'
import { ColumnsField } from 'types/schema'
import { fetchSchema } from '../queries-and-mutations'
import SchemaTable from './schema-table'

type SchemaTabProps = { resourceId: number }

export default function SchemaTab({ resourceId }: SchemaTabProps) {
  const { isLoading, data: schema, error } = useQuery(
    ['schema', resourceId],
    () => fetchSchema(resourceId),
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

  const schemaContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="px-3 space-y-4">
          <div className="w-full h-8 mb-2 rounded bg-background-secondary animate-pulse" />
          {range(10).map((val) => (
            <div
              key={val}
              className="w-full h-4 bg-background-secondary animate-pulse"
              style={{ opacity: 1 - val / 10 }}
            />
          ))}
        </div>
      )
    }

    if (filteredSchema) {
      return (
        <Scrollbars className="h-full" autoHide>
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
          {filteredSchema?.map((table: any) => (
            <SchemaTable
              key={table.table}
              table={table}
              resourceId={resourceId}
            />
          ))}
        </Scrollbars>
      )
    }

    if (error) {
      return <Result status="warning" subTitle={(error as any).message} />
    }

    return null
  }, [isLoading, filteredSchema, resourceId, input, error])

  return <div className="flex flex-col h-full">{schemaContent}</div>
}
