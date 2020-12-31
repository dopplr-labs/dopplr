import React from 'react'
import { Line, Area, Bar, Column, Pie, Scatter } from '@ant-design/charts'
import {
  LineChartOutlined,
  AreaChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
  DotChartOutlined,
} from '@ant-design/icons'
import { ChartTypes } from 'types/chart'

const config = {
  data: [],
  xField: 'label',
  yField: 'value',
  seriesField: 'type',
  autoFit: true,
}

export const chartList = {
  line: {
    icon: <LineChartOutlined />,
    label: 'Line Chart',
    chart: <Line {...config} />,
  },
  area: {
    icon: <AreaChartOutlined />,
    label: 'Area Chart',
    chart: <Area {...config} isStack={false} isPercent={false} />,
  },
  stackedArea: {
    icon: <AreaChartOutlined />,
    label: 'Stacked Area Chart',
    chart: <Area {...config} isStack isPercent={false} />,
  },
  stackedArea100: {
    icon: <AreaChartOutlined />,
    label: '100% Stacked Area Chart',
    chart: <Area {...config} isStack isPercent />,
  },
  column: {
    icon: <BarChartOutlined />,
    label: 'Column Chart',
    chart: <Column {...config} isGroup />,
  },
  stackedColumn: {
    icon: <BarChartOutlined />,
    label: 'Stacked Column Chart',
    chart: <Column {...config} isGroup={false} />,
  },
  stackedColumn100: {
    icon: <BarChartOutlined />,
    label: '100% Stacked Column Chart',
    chart: <Column {...config} isStack isPercent />,
  },
  bar: {
    icon: <BarChartOutlined className="transform rotate-90" />,
    label: 'Bar Chart',
    chart: <Bar {...config} xField="value" yField="label" isGroup />,
  },
  stackedBar: {
    icon: <BarChartOutlined className="transform rotate-90" />,
    label: 'Stacked Bar Chart',
    chart: <Bar {...config} xField="value" yField="label" isGroup={false} />,
  },
  stackedBar100: {
    icon: <BarChartOutlined className="transform rotate-90" />,
    label: '100% Stacked Bar Chart',
    chart: <Bar {...config} xField="value" yField="label" isStack isPercent />,
  },
  pie: {
    icon: <PieChartOutlined />,
    label: 'Pie Chart',
    chart: <Pie data={[]} angleField="value" colorField="label" />,
  },
  scatter: {
    icon: <DotChartOutlined />,
    label: 'Scatter Plot',
    chart: <Scatter {...config} colorField="type" />,
  },
}

export const chartOrder: ChartTypes[] = [
  'line',
  'area',
  'stackedArea',
  'stackedArea100',
  'column',
  'stackedColumn',
  'stackedColumn100',
  'bar',
  'stackedBar',
  'stackedBar100',
  'pie',
  'scatter',
]
