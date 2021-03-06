import React, { useCallback, useContext, useMemo } from 'react'
import { Button } from 'antd'
import {
  AreaChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { useSearchParams } from 'react-router-dom'
import EditorContext from 'contexts/editor-context'
import CreateChart from './create-chart'
import ChartsList from './charts-list'
import ChartDetail from './chart-detail'

export default function ChartTab() {
  const { queryResult: data, isSaved } = useContext(EditorContext)

  const [searchParams, setSearchParams] = useSearchParams({ chart: 'new' })
  const activeChartId = searchParams.get('chart')

  const handleOpenChartDetail = useCallback(
    (id: string) => {
      setSearchParams({ tab: 'chart', chart: id })
    },
    [setSearchParams],
  )

  const runQueryPlaceholder = useMemo(
    () => (
      <div className="flex flex-col items-center justify-center flex-1 h-full space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
            <LineChartOutlined className="text-3xl text-gray-400" />
            <div className="text-xs">Line Chart</div>
          </div>
          <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
            <AreaChartOutlined className="text-3xl text-gray-400" />
            <div className="text-xs">Area Chart</div>
          </div>
          <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
            <PieChartOutlined className="text-3xl text-gray-400" />
            <div className="text-xs">Pie Chart</div>
          </div>
          <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
            <BarChartOutlined className="text-3xl text-gray-400" />
            <div className="text-xs">Bar Chart</div>
          </div>
        </div>
        <div className="text-gray-500 ">Run query to plot charts</div>
      </div>
    ),
    [],
  )

  const chartTabContent = useMemo(() => {
    if (!data) {
      return runQueryPlaceholder
    }

    if (activeChartId === 'new') {
      return <CreateChart changeActiveChartId={handleOpenChartDetail} />
    }

    return <ChartDetail />
  }, [data, runQueryPlaceholder, activeChartId, handleOpenChartDetail])

  return (
    <div className="flex w-full h-full bg-white">
      <div className="flex-shrink-0 w-64 h-full border-r">
        <div className="flex flex-col h-full">
          <div className="pb-4 pr-4 mb-2 border-b">
            <div className="text-base font-medium text-content-primary">
              Charts
            </div>
            <div className="text-xs">
              Plot different charts according to your requirement using query
              result
            </div>
            {activeChartId !== 'new' ? (
              <div className="mt-4">
                <Button
                  icon={<PlusOutlined />}
                  className="w-full"
                  type="primary"
                  disabled={activeChartId === 'new'}
                  onClick={() => {
                    handleOpenChartDetail('new')
                  }}
                >
                  Create New
                </Button>
              </div>
            ) : null}
          </div>
          {isSaved ? <ChartsList /> : null}
        </div>
      </div>
      {chartTabContent}
    </div>
  )
}
