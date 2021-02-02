import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/auth/auth.module'
import { SettingsRepository } from './settings-repository'
import { SettingsController } from './settings.controller'
import { SettingsService } from './settings.service'

@Module({
  controllers: [SettingsController],
  providers: [SettingsService],
  imports: [AuthModule, TypeOrmModule.forFeature([SettingsRepository])]
})
export class SettingsModule {}
