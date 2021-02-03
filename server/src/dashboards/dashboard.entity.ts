import { DashboardChart } from 'src/dashboard-charts/dashboard-chart.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export type Layout = {
  x: number
  y: number
  w: number
  h: number
  i: string
}

@Entity()
export class Dashboard {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(
    () => DashboardChart,
    dashboardChart => dashboardChart.dashboard,
  )
  dashboardCharts: DashboardChart[]

  @Column({ length: 500 })
  name: string

  @Column({ length: 2000, nullable: true })
  description?: string

  @Column({ type: 'json', nullable: true })
  layout: Layout[]

  @Column()
  uid: string
}
