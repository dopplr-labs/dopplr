import { Module } from '@nestjs/common'
import { ResourcesModule } from 'src/resources/resources.module'
import { LanguageServerGateway } from './language-server.gateway'

@Module({
  imports: [ResourcesModule],
  providers: [LanguageServerGateway],
})
export class LanguageServer {}
