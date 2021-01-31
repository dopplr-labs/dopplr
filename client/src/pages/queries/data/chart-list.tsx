import React from 'react'
import { Line, Area, Bar, Column, Pie, Scatter } from '@ant-design/charts'
import {
  LineChartOutlined,
  AreaChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
  DotChartOutlined,
} from '@ant-design/icons'
import { ChartType } from 'types/chart'

const config = {
  data: [],
  xField: 'label',
  yField: 'value',
  seriesField: 'type',
  autoFit: true,
}

const pieConfig = {
  data: [],
  angleField: 'value',
  colorField: 'label',
  interactions: [
    { type: 'element-selected' },
    { type: 'element-active' },
    { type: 'pie-statistic-active' },
  ],
  statistic: {
    title: {
      style: {
        whiteSpace: 'pre-wrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: '16px',
      },
      customHtml: () => 'Total',
    },
    content: {
      style: {
        whiteSpace: 'pre-wrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: '24px',
      },
    },
  },
}

export const chartList = {
  line: {
    group: 'Line',
    icon: <LineChartOutlined />,
    label: 'Line Chart',
    chart: <Line {...config} smooth={false} />,
  },
  smoothLine: {
    group: 'Line',
    icon: <LineChartOutlined />,
    label: 'Smooth Line Chart',
    chart: <Line {...config} smooth={true} />,
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
    chart: <Pie {...pieConfig} innerRadius={0} />,
  },
  ring: {
    group: 'Pie',
    icon: <PieChartOutlined />,
    label: 'Ring Chart',
    chart: <Pie {...pieConfig} innerRadius={0.6} />,
  },
  scatter: {
    group: 'Other',
    icon: <DotChartOutlined />,
    label: 'Scatter Plot',
    chart: <Scatter {...config} colorField="type" />,
  },
}

export const chartOrder: ChartType[] = [
  ChartType.LINE,
  ChartType.SMOOTH_LINE,
  ChartType.AREA,
  ChartType.STACKED_AREA,
  ChartType.STACKED_AREA_100,
  ChartType.COLUMN,
  ChartType.STACKED_COLUMN,
  ChartType.STACKED_COLUMN_100,
  ChartType.BAR,
  ChartType.STACKED_BAR,
  ChartType.STACKED_BAR_100,
  ChartType.PIE,
  ChartType.RING,
  ChartType.SCATTER,
]

export const chartGroups = ['Line', 'Area', 'Column', 'Bar', 'Pie', 'Other']
