import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { text } from 'express'
import { User } from 'src/auth/user.types'
import { TextEditorSettingsRepository } from './settings-repository'
import { TextEditorSettingsUpdateDto } from './settings.dto'
import { TextEditorSettings } from './settings.entity'

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(TextEditorSettingsRepository)
    private textEditorSettingsRepository: TextEditorSettingsRepository,
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
    const textEditorSettings = await this.textEditorSettingsRepository.findOne({
      where,
    })

    return textEditorSettings
  }

  /**
   * Updates user text editor settings
   *
   * @param id - id of the settings row, user wants to update
   * @param textEditorSettingsUpdateDto - Data for updating the text editor settings
   * @param user - user object
   */
  async updateTextEditorSettings(
    id: number,
    textEditorSettingsUpdateDto: TextEditorSettingsUpdateDto,
    user: User,
  ): Promise<TextEditorSettings> {
    return this.textEditorSettingsRepository
      .update(
        {
          id,
          uid: user.uid,
        },
        textEditorSettingsUpdateDto,
      )
      .then(() => this.getTextEditorSettings(user))
  }
}
