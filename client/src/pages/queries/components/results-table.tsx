import React, { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  CaretRightFilled,
  FilePdfOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import { Dropdown, Menu, Result, Table } from 'antd'
import clsx from 'clsx'
import { range } from 'lodash-es'
import useMeasure from 'react-use-measure'
import { QueryResult } from 'types/query'

const PAGINATION_CONTAINER_HEIGHT = 64

type ResultsTableProps = {
  data: QueryResult | null
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

  const downloadOptions = useMemo(() => {
    return (
      <Menu>
        <Menu.Item className="flex items-center">
          <FileTextOutlined /> CSV
        </Menu.Item>
        <Menu.Item className="flex items-center space-x-3">
          <FilePdfOutlined /> PDF
        </Menu.Item>
      </Menu>
    )
  }, [])

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div>
          {range(7).map((row) => (
            <div className="flex" key={row}>
              {range(5).map((col) => (
                <div className="flex-1 p-2 border" key={col}>
                  <div className="w-full h-4 bg-background-secondary animate-pulse" />
                </div>
              ))}
            </div>
          ))}
        </div>
      )
    }

    if (error) {
      return (
        <Result
          status="warning"
          subTitle={
            error?.response?.data?.message ??
            'Something went wrong. Please try again'
          }
        />
      )
    }

    if (data) {
      const tableFooter = document
        .getElementById('table-container')
        ?.querySelector('.ant-table-pagination-right')

      return (
        <>
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
          {tableFooter
            ? createPortal(
                <div className="flex justify-end flex-1">
                  <Dropdown.Button overlay={downloadOptions} type="primary">
                    Download
                  </Dropdown.Button>
                </div>,
                tableFooter,
              )
            : null}
        </>
      )
    }

    return (
      <div className="flex items-center justify-center h-full space-x-1 text-content-tertiary">
        <span>Click</span>
        <span className="inline-flex items-center px-2 space-x-1 border">
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
    containerBounds,
    tableHeaderSize,
    downloadOptions,
  ])

  return (
    <div
      className={clsx('flex flex-col h-full', className)}
      id="table-container"
      style={style}
      ref={measureContainer}
    >
      {content}
    </div>
  )
}
