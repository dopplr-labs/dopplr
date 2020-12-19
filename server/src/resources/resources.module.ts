import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/auth/auth.module'
import { QueriesModule } from 'src/queries/queries.module'
import { ResourceRepository } from './resource.repository'
import { ResourcesController } from './resources.controller'
import { ResourcesService } from './resources.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([ResourceRepository]),
    AuthModule,
    forwardRef(() => QueriesModule),
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService],
  exports: [ResourcesService],
})
export class ResourcesModule {}
