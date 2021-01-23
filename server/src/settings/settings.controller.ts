import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/auth/auth.guard'
import { GetUser } from 'src/auth/get-user.decorator'
import {
  TextEditorSettingsDto,
  TextEditorSettingsUpdateDto,
} from './settings.dto'
import { SettingsService } from './settings.service'
import { TextEditorSettings } from './settings.entity'

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
    @Param('id') id: number,
    @Body() textEditorSettingsUpdateDto: TextEditorSettingsUpdateDto,
    @GetUser() user,
  ): Promise<{ success: boolean; data: TextEditorSettings }> {
    const textEditorSettings = await this.settingService.updateTextEditorSettings(
      id,
      textEditorSettingsUpdateDto,
      user,
    )
    return {
      success: true,
      data: textEditorSettings,
    }
  }
}
