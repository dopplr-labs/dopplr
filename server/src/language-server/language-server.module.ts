import { Module } from '@nestjs/common'
import { AuthModule } from 'src/auth/auth.module'
import { ResourcesModule } from 'src/resources/resources.module'
import { LanguageServerGateway } from './language-server.gateway'

@Module({
  imports: [ResourcesModule, AuthModule],
  providers: [LanguageServerGateway],
})
export class LanguageServer {}
