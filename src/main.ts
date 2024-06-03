import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { Logger, VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { RedisIoAdapter } from './adapters/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      // logger: true,
    })
  )

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  // Don't forget to enable CORS
  app.enableCors({
    credentials: true,
    origin: '*',
  })

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1']
  });
  
  app.useWebSocketAdapter(redisIoAdapter);


  await app.listen(process.env.PORT || 3000, (err: Error, appUri: string) => {
    if (err) {
      console.log(err)
      return
    }
    Logger.log(`Server running at ${appUri}`)
  })
}
bootstrap();