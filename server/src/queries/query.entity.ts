import { Resource } from 'src/resources/resource.entity'
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
    () => Resource,
    resource => resource.queries,
    { eager: true },
  )
  resource: Resource

  @Column({ length: 500, nullable: true })
  name?: string

  @Column()
  query: string

  @Column()
  isSaved: boolean
}
