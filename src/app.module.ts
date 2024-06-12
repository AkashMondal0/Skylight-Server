import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './db/drizzle/drizzle.module';
import configuration from './configs/configuration';
import { RedisModule } from './db/redisio/redis.module';
import { _GraphQLModule } from './graphql/graphql.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guard/roles.guard';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    DrizzleModule,
    RedisModule,
    _GraphQLModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: ['.env', '.env.development'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },],
})

export class AppModule {}