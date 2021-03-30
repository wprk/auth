import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as cookieParser from 'cookie-parser'

import { AppModule } from './app.module'
import { EntityNotFoundExceptionFilter } from './filters/entity-not-found-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config: ConfigService = app.get(ConfigService)
  const port = config.get<number>('server.port')

  app.enableCors({
    credentials: config.get<boolean>('cors.credentials'),
    origin: config.get<string[]>('cors.origin'),
  })
  app.use(cookieParser())
  app.useGlobalFilters(new EntityNotFoundExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

  await app.listen(port, () => {
    console.log(`Auth server listening on port ${port}...`)
  })
}
bootstrap()
