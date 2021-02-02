import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/user.types'
import { SettingsRepository } from './settings-repository'
import { TextEditorSettingsUpdateDto } from './dtos/settings.dto'
import { TextEditorSettings } from './settings.types'

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SettingsRepository)
    private settingsRepository: SettingsRepository,
  ) {}

  /**
   * Returns text editor settings of the user
   *
   * @param user - user object
   */
  async getTextEditorSettings(user: User): Promise<TextEditorSettings> {
    const where: { uid: string } = {
      uid: user.uid,
    }
    const settings = await this.settingsRepository.findOne({
      where,
    })

    return settings.textEditorSettings
  }

  /**
   * Updates user text editor settings
   *
   * @param textEditorSettingsUpdateDto - Data for updating the text editor settings
   * @param user - user object
   */
  async updateTextEditorSettings(
    textEditorSettingsUpdateDto: TextEditorSettingsUpdateDto,
    user: User,
  ): Promise<TextEditorSettings> {
    const where: { uid: string } = {
      uid: user.uid,
    }
    const settings = await this.settingsRepository.findOne({
      where,
    })
    const updatedSettings = await this.settingsRepository.preload({
      id: settings.id,
      uid: settings.uid,
      textEditorSettings: {
        ...settings.textEditorSettings,
        ...textEditorSettingsUpdateDto,
      },
    })

    const savedSettings = await this.settingsRepository.save(updatedSettings)
    return savedSettings.textEditorSettings
  }
}
