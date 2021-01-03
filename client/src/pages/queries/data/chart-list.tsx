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
    group: 'Line',
    icon: <LineChartOutlined />,
    label: 'Line Chart',
    chart: <Line {...config} />,
  },
  area: {
    group: 'Area',
    icon: <AreaChartOutlined />,
    label: 'Area Chart',
    chart: <Area {...config} isStack={false} isPercent={false} />,
  },
  stackedArea: {
    group: 'Area',
    icon: <AreaChartOutlined />,
    label: 'Stacked Area Chart',
    chart: <Area {...config} isStack isPercent={false} />,
  },
  stackedArea100: {
    group: 'Area',
    icon: <AreaChartOutlined />,
    label: '100% Stacked Area Chart',
    chart: <Area {...config} isStack isPercent />,
  },
  column: {
    group: 'Column',
    icon: <BarChartOutlined />,
    label: 'Column Chart',
    chart: <Column {...config} isGroup />,
  },
  stackedColumn: {
    group: 'Column',
    icon: <BarChartOutlined />,
    label: 'Stacked Column Chart',
    chart: <Column {...config} isGroup={false} />,
  },
  stackedColumn100: {
    group: 'Column',
    icon: <BarChartOutlined />,
    label: '100% Stacked Column Chart',
    chart: <Column {...config} isStack isPercent />,
  },
  bar: {
    group: 'Bar',
    icon: <BarChartOutlined className="transform rotate-90" />,
    label: 'Bar Chart',
    chart: <Bar {...config} xField="value" yField="label" isGroup />,
  },
  stackedBar: {
    group: 'Bar',
    icon: <BarChartOutlined className="transform rotate-90" />,
    label: 'Stacked Bar Chart',
    chart: <Bar {...config} xField="value" yField="label" isGroup={false} />,
  },
  stackedBar100: {
    group: 'Bar',
    icon: <BarChartOutlined className="transform rotate-90" />,
    label: '100% Stacked Bar Chart',
    chart: <Bar {...config} xField="value" yField="label" isStack isPercent />,
  },
  pie: {
    group: 'Pie',
    icon: <PieChartOutlined />,
    label: 'Pie Chart',
    chart: <Pie data={[]} angleField="value" colorField="label" />,
  },
  scatter: {
    group: 'Other',
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

export const chartGroups = ['Line', 'Area', 'Column', 'Bar', 'Pie', 'Other']
