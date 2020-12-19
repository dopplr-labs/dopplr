import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/auth/auth.module'
import { ResourcesModule } from 'src/resources/resources.module'
import { QueriesController } from './queries.controller'
import { QueriesService } from './queries.service'
import { QueryRepository } from './query.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([QueryRepository]),
    forwardRef(() => ResourcesModule),
    AuthModule,
  ],
  controllers: [QueriesController],
  providers: [QueriesService],
  exports: [QueriesService],
})
export class QueriesModule {}
