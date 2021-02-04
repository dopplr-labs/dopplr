import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/auth/auth.guard'
import { GetUser } from 'src/auth/get-user.decorator'
import { SettingsDto, TextEditorSettingsUpdateDto } from './dtos/settings.dto'
import { Settings } from './entities/settings.entity'
import { SettingsService } from './settings.service'
import { TextEditorSettings } from './settings.types'

@Controller('settings')
@UseGuards(AuthGuard)
export class SettingsController {
  constructor(private readonly settingService: SettingsService) {}

  @Get('')
  async getSettings(
    @GetUser() user,
  ): Promise<{ success: boolean; data: Settings }> {
    const settings = await this.settingService.getSettings(user)
    return { success: true, data: settings }
  }

  @Post('')
  async createSettings(
    @Body() settingsDto: SettingsDto,
    @GetUser() user,
  ): Promise<{ success: boolean; data: Settings }> {
    const settings = await this.settingService.createSettings(settingsDto, user)
    return { success: true, data: settings }
  }

  @Patch('texteditorsettings')
  async updateTextEditorSettings(
    @Body() textEditorSettingsUpdateDto: TextEditorSettingsUpdateDto,
    @GetUser() user,
  ): Promise<{ success: boolean; data: TextEditorSettings }> {
    const textEditorSettings = await this.settingService.updateTextEditorSettings(
      textEditorSettingsUpdateDto,
      user,
    )
    return {
      success: true,
      data: textEditorSettings,
    }
  }
}
