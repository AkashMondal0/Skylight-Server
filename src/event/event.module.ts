import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { RedisModule } from 'src/db/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [EventGateway],
  exports: [EventGateway],
})
export class EventsModule { }