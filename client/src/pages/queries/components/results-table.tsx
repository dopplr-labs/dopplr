import React, { useCallback, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  CaretRightFilled,
  DownloadOutlined,
  FilePdfOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import { Dropdown, Button, Menu, message, Result, Table } from 'antd'
import clsx from 'clsx'
import { range } from 'lodash-es'
import useMeasure from 'react-use-measure'
import { saveAs } from 'file-saver'
import { QueryResult } from 'types/query'
import client from 'utils/client'
import dayjs from 'dayjs'

const PAGINATION_CONTAINER_HEIGHT = 64

type ResultsTableProps = {
  query: string
  resourceId: number
  fileName?: string
  data?: QueryResult
  isLoading: boolean
  error?: any
  className?: string
  style?: React.CSSProperties
}

export default function ResultsTable({
  query,
  resourceId,
  fileName,
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

  const [downloadingData, setDownloadingData] = useState(false)

  const downloadData = useCallback(
    async (fileType, fileExtension) => {
      setDownloadingData(true)
      try {
        const { data, headers } = await client.post('/queries/download', {
          query,
          resource: resourceId,
          fileType,
        })
        const blob = new Blob([data], { type: headers['content-type'] })
        saveAs(
          blob,
          `${fileName ?? query.slice(0, 20)}-${dayjs().format(
            'YYYY-MM-DD_HH:mm',
          )}.${fileExtension}`,
        )
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message ??
          'Something went wrong. Please try again'
        message.error(errorMessage)
      } finally {
        setDownloadingData(false)
      }
    },
    [query, resourceId, fileName],
  )

  const downloadDataAsCSV = useCallback(() => {
    downloadData('CSV', 'csv')
  }, [downloadData])

  const downloadDataAsPDF = useCallback(async () => {
    downloadData('PDF', 'pdf')
  }, [downloadData])

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
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item
                          className="flex items-center"
                          onClick={downloadDataAsCSV}
                        >
                          <FileTextOutlined /> Download as CSV
                        </Menu.Item>
                        <Menu.Item
                          className="flex items-center space-x-3"
                          onClick={downloadDataAsPDF}
                        >
                          <FilePdfOutlined /> Download as PDF
                        </Menu.Item>
                      </Menu>
                    }
                    placement="topRight"
                  >
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      loading={downloadingData}
                      disabled={downloadingData}
                    >
                      Download Data
                    </Button>
                  </Dropdown>
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
    downloadDataAsCSV,
    downloadDataAsPDF,
    downloadingData,
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
