import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ResourcesModule } from 'src/resources/resources.module'
import { QueriesController } from './queries.controller'
import { QueriesService } from './queries.service'
import { QueryRepository } from './query.repository'

@Module({
  imports: [TypeOrmModule.forFeature([QueryRepository]), ResourcesModule],
  controllers: [QueriesController],
  providers: [QueriesService],
})
export class QueriesModule {}
