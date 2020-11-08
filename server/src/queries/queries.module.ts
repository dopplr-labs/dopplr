import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConnectionsModule } from 'src/connections/connections.module'
import { QueriesController } from './queries.controller'
import { QueriesService } from './queries.service'
import { QueryRepository } from './query.repository'

@Module({
  imports: [TypeOrmModule.forFeature([QueryRepository]), ConnectionsModule],
  controllers: [QueriesController],
  providers: [QueriesService],
})
export class QueriesModule {}
