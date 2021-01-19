import { Result } from 'antd'
import clsx from 'clsx'
import EditorContext from 'contexts/editor-context'
import { range } from 'lodash-es'
import React, { useContext, useMemo } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { useQuery } from 'react-query'
import { fetchChartsForQuery } from '../chart-queries'

type ChartsListProps = {
  activeChartId: number
  changeActiveChartId: (id: number) => void
}
export default function ChartsList({
  activeChartId,
  changeActiveChartId,
}: ChartsListProps) {
  const { queryId } = useContext(EditorContext)

  const { data: charts, isLoading, error } = useQuery(['charts', queryId], () =>
    fetchChartsForQuery(parseInt(queryId)),
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
            chart.id === activeChartId ? 'text-brand-primary' : 'text-gray-700',
          )}
          onClick={() => changeActiveChartId(chart.id)}
        >
          {chart.name}
        </div>
      ))
    }
  }, [isLoading, error, charts, changeActiveChartId, activeChartId])

  return (
    <Scrollbars className="flex-1">
      <div className="py-2">{chartsListContent}</div>
    </Scrollbars>
  )
}
