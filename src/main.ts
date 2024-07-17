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
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
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
    secret: envs.JWT_SECRET,
  });

  await app.listen(envs.POST ?? 5000, "0.0.0.0")
  for (const key in envs) {
    const element = envs[key];
    if (!element) {
      Logger.error(`[ENV] ${key}: ❌`)
    } else {
      Logger.log(`[ENV] ${key}: ${element} ✅`)
    }
  }
  Logger.log(`Application is running on: ${await app.getUrl()}`)
  setInterval(() => {
    fetch("https://skylight-nestjs-server.onrender.com/v1")
      .then((res) => {
        Logger.log("hit api")
      }).catch((e) => {
        Logger.error("hit api error")
      })
  }, 1000 * 60 * 5)
}

bootstrap();