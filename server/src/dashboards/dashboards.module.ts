import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/auth/auth.module'
import { DashboardsService } from './dashboards.service'
import { DashboardsController } from './dashboards.controller'
import { DashboardRepository } from './dashboard.repository'

@Module({
  imports: [TypeOrmModule.forFeature([DashboardRepository]), AuthModule],
  controllers: [DashboardsController],
  providers: [DashboardsService],
})
export class DashboardsModule {}
