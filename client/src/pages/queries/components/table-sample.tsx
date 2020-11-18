import React, { useEffect, useMemo } from 'react'
import { Modal, Result, Table } from 'antd'
import { range } from 'lodash-es'
import { useMutation } from 'react-query'
import { runQuery } from '../queries-and-mutations'

export type TableSampleProps = {
  visible: boolean
  onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  resourceId: number
  tableName: string
}

export default function TableSample({
  visible,
  onCancel,
  resourceId,
  tableName,
}: TableSampleProps) {
  const [runQueryMutation, { isLoading, data, error }] = useMutation(runQuery)

  useEffect(() => {
    runQueryMutation({
      resource: resourceId,
      query: `SELECT * FROM ${tableName} LIMIT 10`,
    })
  }, [resourceId, runQueryMutation, tableName])

  const modalContent = useMemo(() => {
    if (isLoading) {
      return (
        <div>
          {range(7).map((row) => (
            <div className="flex" key={row}>
              {range(5).map((col) => (
                <div className="flex-1 p-2 border" key={col}>
                  <div className="w-full h-4 bg-gray-200 animate-pulse" />
                </div>
              ))}
            </div>
          ))}
        </div>
      )
    }

    if (error) {
      return <Result status="warning" subTitle={(error as any).message} />
    }

    if (data) {
      return (
        <Table
          columns={data.fields.map((field) => ({
            key: field.name,
            title: <span title={field.name}>{field.name}</span>,
            dataIndex: field.name,
            width: 120,
            // eslint-disable-next-line react/display-name
            render: (value: any) => (
              <span className="text-xs">{String(value)}</span>
            ),
          }))}
          dataSource={data.rows.map((row: any, index: number) => ({
            key: (index + 1).toString(),
            ...row,
          }))}
          size="small"
          pagination={false}
          scroll={{ x: 672, y: 300 }}
        />
      )
    }
  }, [isLoading, error, data])

  return (
    <Modal
      title={`${tableName} sample`}
      visible={visible}
      onCancel={onCancel}
      width={720}
    >
      {modalContent}
    </Modal>
  )
}
