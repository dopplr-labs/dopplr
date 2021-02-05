import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { DefaultTextEditorSettings } from '../data/default-settings'
import { TextEditorSettings } from '../settings.types'

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  id: number

  @Column('simple-json', { default: DefaultTextEditorSettings })
  textEditorSettings: TextEditorSettings

  @Column()
  uid: string
}
