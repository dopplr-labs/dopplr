import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Chart } from 'src/charts/chart.entity'
import { Dashboard } from 'src/dashboards/dashboard.entity'

@Entity()
export class DashboardChart {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(
    () => Chart,
    chart => chart.dashboardCharts,
    { eager: true, onDelete: 'CASCADE' },
  )
  chart: Chart

  @ManyToOne(
    () => Dashboard,
    dashboard => dashboard.dashboardCharts,
    { eager: true, onDelete: 'CASCADE' },
  )
  dashboard: Dashboard

  @Column()
  uid: string
}
