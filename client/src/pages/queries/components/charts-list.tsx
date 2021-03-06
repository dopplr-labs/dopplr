import React, { useCallback, useContext, useMemo } from 'react'
import { Result } from 'antd'
import clsx from 'clsx'
import EditorContext from 'contexts/editor-context'
import { range } from 'lodash-es'
import Scrollbars from 'react-custom-scrollbars'
import { useQuery } from 'react-query'
import { useSearchParams } from 'react-router-dom'
import { fetchChartsForQuery } from '../chart-queries'

export default function ChartsList() {
  const { queryId } = useContext(EditorContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const activeChartId = searchParams.get('chart')

  const handleOpenChartDetail = useCallback(
    (id: string) => {
      setSearchParams({ tab: 'chart', chart: id })
    },
    [setSearchParams],
  )

  const { data: charts, isLoading, error } = useQuery(
    ['charts', queryId],
    () => fetchChartsForQuery(parseInt(queryId)),
    {
      onSettled: (data) => {
        if (data?.length && !searchParams.get('chart')) {
          handleOpenChartDetail(data[0].id.toString())
        }
      },
    },
  )

  const chartsListContent = useMemo(() => {
    if (isLoading) {
      return range(5).map((val) => (
        <div key={val} className="py-1 pr-4">
          <div
            className="w-full h-4 bg-background-secondary animate-pulse"
            style={{ opacity: 1 - val / 5 }}
          />
        </div>
      ))
    }

    if (error) {
      return <Result status="warning" subTitle={(error as any).message} />
    }

    if (charts) {
      return charts.map((chart) => (
        <div
          key={chart.id}
          className={clsx(
            'w-full py-2 text-xs cursor-pointer hover:text-brand-primary',
            chart.id.toString() === activeChartId
              ? 'text-brand-primary'
              : 'text-gray-700',
          )}
          onClick={() => {
            handleOpenChartDetail(chart.id.toString())
          }}
        >
          {chart.name}
        </div>
      ))
    }
  }, [isLoading, error, charts, activeChartId, handleOpenChartDetail])

  return (
    <Scrollbars className="flex-1">
      <div className="py-2">{chartsListContent}</div>
    </Scrollbars>
  )
}
