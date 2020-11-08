import { Connection } from 'src/connections/connection.entity'
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Query {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(
    () => Connection,
    connection => connection.queries,
    { eager: true },
  )
  connection: Connection

  @Column({ length: 500, nullable: true })
  name?: string

  @Column()
  query: string

  @Column()
  isSaved: boolean
}
