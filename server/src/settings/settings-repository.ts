import { EntityRepository, Repository } from 'typeorm'
import { TextEditorSettings } from './settings.entity'

@EntityRepository(TextEditorSettings)
export class TextEditorSettingsRepository extends Repository<TextEditorSettings> {}
