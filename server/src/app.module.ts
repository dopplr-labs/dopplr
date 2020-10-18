import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HealthModule } from './health/health.module'

@Module({
  imports: [HealthModule, ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule {}
