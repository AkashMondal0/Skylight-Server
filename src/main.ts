import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { Logger, VersioningType } from '@nestjs/common';
import configuration from './configs/configuration';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      // logger: true,
    })
  )
  // Don't forget to enable CORS
  app.enableCors({
    credentials: true,
    origin: '*',
  })

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1']
  });


  await app.listen(configuration().POST ?? 3001, (err: Error, appUri: string) => {
    if (!configuration().POST) console.log(`Server Env Port is not set, using default port 3000`)
    if (err) {
      console.log(err)
      return
    }
    Logger.log(`Server running at ${appUri}`)
  })
}
bootstrap();