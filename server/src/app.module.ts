import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HealthModule } from './health/health.module'
import { ResourcesModule } from './resources/resources.module'
import { QueriesModule } from './queries/queries.module'
import { LanguageServer } from './language-server/language-server.module'

@Module({
  imports: [
    HealthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: Number.parseInt(process.env.POSTGRES_PORT || '5432'),
      host: process.env.DB_HOST,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      ssl: process.env.NODE_ENV === 'production',
      synchronize: true,
    }),
    ResourcesModule,
    QueriesModule,
    LanguageServer,
  ],
})
export class AppModule {}
