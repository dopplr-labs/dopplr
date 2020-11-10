import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ResourceRepository } from './resource.repository'
import { ResourcesController } from './resources.controller'
import { ResourcesService } from './resources.service'

@Module({
  imports: [TypeOrmModule.forFeature([ResourceRepository])],
  controllers: [ResourcesController],
  providers: [ResourcesService],
  exports: [ResourcesService],
})
export class ResourcesModule {}
