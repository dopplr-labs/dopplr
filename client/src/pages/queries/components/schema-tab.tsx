import React, { useMemo, useState } from 'react'
import { matchSorter } from 'match-sorter'
import { SearchOutlined } from '@ant-design/icons'
import { Input, Result } from 'antd'
import { useQuery } from 'react-query'
import Scrollbars from 'react-custom-scrollbars'
import { ColumnsField } from 'types/schema'
import { useParams } from 'react-router-dom'
import { fetchSchema } from 'queries/resource'
import SchemaTable from './schema-table'
import ListSkeletonLoader from './list-skeleton-loader'
import { useTabData } from '../hooks/use-tab-data'
import CreateResourceMessage from './create-resource-message'

export default function SchemaTab() {
  const { tabType, id } = useParams()
  const { isLoadingTabData, originalTabDataError, resourceId } = useTabData(
    `${tabType}/${id}`,
  )

  if (isLoadingTabData) {
    return <ListSkeletonLoader />
  }

  if (originalTabDataError) {
    return (
      <div className="flex items-center justify-center h-full">
        <Result
          status="warning"
          subTitle={(originalTabDataError as Error).message}
        />
      </div>
    )
  }

  if (!resourceId) {
    return <CreateResourceMessage />
  }

  return <ResourceSchema resourceId={resourceId} />
}

type ResourceSchemaProps = { resourceId: number }

function ResourceSchema({ resourceId }: ResourceSchemaProps) {
  const { isLoading, data: schema, error } = useQuery(
    ['schema', resourceId],
    () => fetchSchema(resourceId),
  )

  const [input, setInput] = useState('')

  const filteredSchema = useMemo(() => {
    if (schema) {
      return matchSorter(schema, input, {
        keys: [(table) => table.columns.map((i: ColumnsField) => i.name)],
      })
    }
  }, [input, schema])

  const schemaContent = useMemo(() => {
    if (isLoading) {
      return <ListSkeletonLoader />
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
          {filteredSchema?.map((table) => (
            <SchemaTable
              key={table.name}
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
