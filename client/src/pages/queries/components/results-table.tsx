import {
  CaretRightFilled,
  DownloadOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { Button, Input, Result, Table } from 'antd'
import clsx from 'clsx'
import { range } from 'lodash-es'
import React, { useMemo, useState } from 'react'
import useMeasure from 'react-use-measure'
import { QueryResult } from 'types/query'

const PAGINATION_CONTAINER_HEIGHT = 56

type ResultsTableProps = {
  data?: QueryResult
  isLoading: boolean
  error?: any
  className?: string
  style?: React.CSSProperties
}

export default function ResultsTable({
  data,
  isLoading,
  error,
  className,
  style,
}: ResultsTableProps) {
  const [measureTableContainer, tableContainerBounds] = useMeasure()
  const [tableHeaderSize, setTableHeaderSize] = useState<number | undefined>(
    undefined,
  )

  const content = useMemo(() => {
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
      return <Result status="warning" subTitle={error.message} />
    }

    if (data) {
      return (
        <>
          <div className="flex items-center justify-end flex-shrink-0 mb-4 gap-x-4">
            <Input
              placeholder="Search Table"
              className="w-64"
              prefix={<SearchOutlined />}
            />
            <Button icon={<DownloadOutlined />}>Download</Button>
          </div>
          <div className="flex-1" ref={measureTableContainer}>
            <Table
              columns={data?.fields.map((field) => ({
                key: field.name,
                title: <span title={field.name}>{field.name}</span>,
                dataIndex: field.name,
                width: 120,
              }))}
              dataSource={data?.rows.map((row: any, index: number) => ({
                key: (index + 1).toString(),
                ...row,
              }))}
              rowClassName="text-xs font-sans"
              size="small"
              // @ts-ignore
              onHeaderRow={() => ({
                ref: (node: HTMLTableRowElement) => {
                  if (node) {
                    setTableHeaderSize(node?.getBoundingClientRect()?.height)
                  }
                },
              })}
              scroll={{
                x: tableContainerBounds.width,
                y:
                  tableHeaderSize && tableContainerBounds.height
                    ? tableContainerBounds.height -
                      tableHeaderSize -
                      PAGINATION_CONTAINER_HEIGHT
                    : 0,
              }}
              pagination={{ showSizeChanger: true }}
            />
          </div>
        </>
      )
    }

    return (
      <div className="flex items-center justify-center h-full space-x-1 text-gray-400">
        <span>Click</span>
        <span className="inline-flex items-center px-2 space-x-1 border rounded">
          <CaretRightFilled />
          <span>Run</span>
        </span>
        <span>to run query</span>
      </div>
    )
  }, [
    data,
    isLoading,
    error,
    measureTableContainer,
    tableContainerBounds,
    tableHeaderSize,
  ])

  return (
    <div className={clsx('flex flex-col h-full', className)} style={style}>
      {content}
    </div>
  )
}
