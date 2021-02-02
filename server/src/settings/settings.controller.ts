import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/auth/auth.guard'
import { GetUser } from 'src/auth/get-user.decorator'
import {
  TextEditorSettingsUpdateDto,
} from './dtos/settings.dto'
import { SettingsService } from './settings.service'
import { TextEditorSettings } from './settings.types'

@Controller('settings')
@UseGuards(AuthGuard)
export class SettingsController {
  constructor(private readonly settingService: SettingsService) {}

  @Get('texteditorsettings')
  async getTextEditorSettings(
    @GetUser() user,
  ): Promise<{ success: boolean; data: TextEditorSettings }> {
    const textEditorSettings = await this.settingService.getTextEditorSettings(
      user,
    )
    return { success: true, data: textEditorSettings }
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
