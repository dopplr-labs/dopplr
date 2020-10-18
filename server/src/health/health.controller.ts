import { Controller, Get } from '@nestjs/common'

@Controller('health')
export class HealthController {
  @Get('knock-knock')
  knockKnock() {
    return {
      health: 'ok',
    }
  }
}
