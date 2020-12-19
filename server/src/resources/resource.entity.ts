import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Query } from 'src/queries/query.entity'

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column()
  type: string

  @Column({ length: 500 })
  name: string

  @Column()
  host: string

  @Column()
  port: number

  @Column()
  database: string

  @Column()
  username: string

  @Column()
  password: string

  @OneToMany(
    () => Query,
    query => query.resource,
  )
  queries: Query[]

  @Column()
  uid: string
}
