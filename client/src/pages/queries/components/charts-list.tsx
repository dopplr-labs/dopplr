import { Result } from 'antd'
import EditorContext from 'contexts/editor-context'
import { range } from 'lodash-es'
import React, { useContext, useMemo } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { useQuery } from 'react-query'
import { fetchChartsForQuery } from '../chart-queries'

export default function ChartsList() {
  const { queryId } = useContext(EditorContext)

  const { data: charts, isLoading, error } = useQuery(['charts'], () =>
    fetchChartsForQuery(parseInt(queryId)),
  )

  const chartsListContent = useMemo(() => {
    if (isLoading) {
      return range(5).map((val) => (
        <div key={val} className="px-4 py-1">
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
        <div key={chart.id} className="text-sm">
          {chart.name}
        </div>
      ))
    }
  }, [isLoading, error, charts])

  return (
    <Scrollbars className="flex-1">
      <div className="py-2 space-y-2">{chartsListContent}</div>
    </Scrollbars>
  )
}
