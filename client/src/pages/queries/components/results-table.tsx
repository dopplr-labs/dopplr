import React, { useMemo, useState } from 'react'
import { CaretRightFilled } from '@ant-design/icons'
import { Result, Table } from 'antd'
import clsx from 'clsx'
import { range } from 'lodash-es'
import useMeasure from 'react-use-measure'
import { QueryResult } from 'types/query'

const PAGINATION_CONTAINER_HEIGHT = 96

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
  const [measureContainer, containerBounds] = useMeasure()
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
          <div>
            <Table
              columns={data?.fields.map((field) => ({
                key: field.name,
                title: <span title={field.name}>{field.name}</span>,
                dataIndex: field.name,
                width: 120,
                // eslint-disable-next-line react/display-name
                render: (value: any) => (
                  <span className="text-xs">{String(value)}</span>
                ),
              }))}
              dataSource={data?.rows.map((row: any, index: number) => ({
                key: (index + 1).toString(),
                ...row,
              }))}
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
                x: containerBounds.width,
                y:
                  tableHeaderSize && containerBounds.height
                    ? containerBounds.height -
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
        <span className="inline-flex items-center px-2 space-x-1 border">
          <CaretRightFilled />
          <span>Run</span>
        </span>
        <span>to run query</span>
      </div>
    )
  }, [data, isLoading, error, containerBounds, tableHeaderSize])

  return (
    <div
      className={clsx('flex flex-col h-full', className)}
      style={style}
      ref={measureContainer}
    >
      {content}
    </div>
  )
}
