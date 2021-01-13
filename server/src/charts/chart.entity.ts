import { Query } from 'src/queries/query.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export enum ChartType {}
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
    { eager: true },
  )
  query: Query

  @Column({ length: 500, nullable: true })
  name?: string

  @Column()
  label: string

  @Column({ array: true })
  values: string[]

  @Column({ enum: ChartType })
  type: ChartType

  @Column({ type: 'json' })
  config: ChartConfig

  @Column()
  uid: string
}
