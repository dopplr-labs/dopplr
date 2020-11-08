import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: '*',
  })
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(Number.parseInt(process.env.PORT, 10) || 3001)
}
bootstrap()
