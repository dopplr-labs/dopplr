import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/auth/auth.module'
import { DashboardsService } from './dashboards.service'
import { DashboardsController } from './dashboards.controller'
import { DashboardRepository } from './dashboard.repository'
import { CategoryRepository } from './category.repository'
import { CategoriesService } from './categories.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([DashboardRepository, CategoryRepository]),
    AuthModule,
  ],
  controllers: [DashboardsController],
  providers: [DashboardsService, CategoriesService],
  exports: [DashboardsService],
})
export class DashboardsModule {}
