import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChartsModule } from 'src/charts/charts.module'
import { AuthModule } from 'src/auth/auth.module'
import { DashboardChartsService } from './dashboard-charts.service'
import { DashboardChartsController } from './dashboard-charts.controller'
import { DashboardChartRespository } from './dashboard-chart.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([DashboardChartRespository]),
    forwardRef(() => ChartsModule),
    AuthModule,
  ],
  controllers: [DashboardChartsController],
  providers: [DashboardChartsService],
})
export class DashboardChartsModule {}
