import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { QueriesModule } from 'src/queries/queries.module'
import { AuthModule } from 'src/auth/auth.module'
import { ChartsService } from './charts.service'
import { ChartsController } from './charts.controller'
import { ChartRepository } from './chart.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([ChartRepository]),
    forwardRef(() => QueriesModule),
    AuthModule,
  ],
  controllers: [ChartsController],
  providers: [ChartsService],
  exports: [ChartsService],
})
export class ChartsModule {}
