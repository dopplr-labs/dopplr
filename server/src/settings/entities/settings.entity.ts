import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { TextEditorSettings } from '../settings.types'

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  id: number

  @Column('simple-json')
  textEditorSettings: TextEditorSettings

  @Column()
  uid: string
}
