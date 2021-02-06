import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/user.types'
import { SettingsRepository } from './settings-repository'
import { TextEditorSettingsUpdateDto } from './dtos/settings.dto'
import { TextEditorSettings } from './settings.types'
import { Settings } from './entities/settings.entity'

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SettingsRepository)
    private settingsRepository: SettingsRepository,
  ) {}

  /**
   * Returns settings of the user
   *
   * @param user - user object
   */
  async getSettings(user: User): Promise<Settings> {
    const settings = await this.settingsRepository.findOne({
      where: {
        uid: user.uid,
      },
    })
    if (!settings) {
      throw new NotFoundException('Settings not found!')
    }
    return settings
  }

  /**
   * Create user settings
   *
   * @param user - user object
   */
  async createSettings(user: User): Promise<Settings> {
    const settings = this.settingsRepository.create({
      uid: user.uid,
    })

    return await this.settingsRepository.save(settings)
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
    const settings = await this.settingsRepository.findOne({
      where: {
        uid: user.uid,
      },
    })

    const updatedSettings = await this.settingsRepository.preload({
      id: settings.id,
      textEditorSettings: {
        ...settings.textEditorSettings,
        ...textEditorSettingsUpdateDto,
      },
    })

    const savedSettings = await this.settingsRepository.save(updatedSettings)
    return savedSettings.textEditorSettings
  }
}
