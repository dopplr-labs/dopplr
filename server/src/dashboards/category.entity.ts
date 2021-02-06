import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Dashboard } from './dashboard.entity'

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(
    () => Dashboard,
    dashboard => dashboard.category,
  )
  dashboards: Dashboard[]

  @ManyToOne(
    () => Category,
    category => category.children,
    { nullable: true },
  )
  parent: Category

  @OneToMany(
    () => Category,
    category => category.parent,
    { nullable: true },
  )
  children: Category[]

  @Column({ length: 500 })
  name: string

  @Column()
  uid: string
}
