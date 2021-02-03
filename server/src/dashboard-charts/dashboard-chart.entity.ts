import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Chart } from 'src/charts/chart.entity'

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
  )
  chart: Chart

  @Column()
  uid: string
}
