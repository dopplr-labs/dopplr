import { Module } from '@nestjs/common'
import { OnboardService } from './onboard.service'
import { OnboardController } from './onboard.controller'

@Module({
  controllers: [OnboardController],
  providers: [OnboardService],
})
export class OnboardModule {}
