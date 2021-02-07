import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { DashboardChart } from 'src/dashboard-charts/dashboard-chart.entity'
import { Query } from 'src/queries/query.entity'

export enum ChartType {
  LINE = 'line',
  SMOOTH_LINE = 'smoothLine',
  AREA = 'area',
  STACKED_AREA = 'stackedArea',
  STACKED_AREA_100 = 'stackedArea100',
  COLUMN = 'column',
  STACKED_COLUMN = 'stackedColumn',
  STACKED_COLUMN_100 = 'stackedColumn100',
  BAR = 'bar',
  STACKED_BAR = 'stackedBar',
  STACKED_BAR_100 = 'stackedBar100',
  PIE = 'pie',
  RING = 'ring',
  SCATTER = 'scatter',
}

export type ChartConfig = {}

@Entity()
export class Chart {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(
    () => Query,
    query => query.charts,
    { eager: true, onDelete: 'CASCADE' },
  )
  query: Query

  @OneToMany(
    () => DashboardChart,
    dashboardChart => dashboardChart.chart,
  )
  dashboardCharts: DashboardChart[]

  @Column({ length: 500, nullable: true })
  name?: string

  @Column()
  label: string

  @Column('simple-array')
  values: string[]

  @Column({ enum: ChartType })
  type: ChartType

  @Column({ type: 'json', nullable: true })
  config: ChartConfig

  @Column()
  uid: string
}
