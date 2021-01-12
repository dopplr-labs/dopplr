import { Query } from 'src/queries/query.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

type ChartType = {}
type ChartConfig = {}

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
    { eager: true },
  )
  query: Query

  @Column({ length: 500, nullable: true })
  title?: string

  @Column()
  label: string

  @Column()
  values: string[]

  @Column()
  chartType: ChartType

  @Column()
  config: ChartConfig

  @Column()
  uid: string
}
