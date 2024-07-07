import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { Logger, VersioningType } from '@nestjs/common';
import configuration from './configs/configuration';
import fastifyCookie from '@fastify/cookie';
import cors from '@fastify/cors'
const envs = configuration()

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({})
  )

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1']
  });

  await app.register(cors, {
    origin: true,
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })

  await app.register(fastifyCookie, {
    secret: envs.JWT_SECRET, // for cookies signature
  });


  await app.listen(envs.POST ?? 3001, (err: Error, appUri: string) => {
    for (const key in envs) {
      const element = envs[key];
      if (!element) {
        Logger.error(`[ENV] ${key}: ❌`)
      } else {
        Logger.log(`[ENV] ${key}: ${element} ✅`)
      }
    }

    if (err) {
      Logger.log("start", err)
      return
    }
    Logger.log(`Server running at ${appUri}`)
  })
}
bootstrap();