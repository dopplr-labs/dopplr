import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Connection {
  @PrimaryGeneratedColumn()
  id: number

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
}
