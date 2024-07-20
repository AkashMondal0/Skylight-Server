import { Module } from '@nestjs/common';
import { EventsGateway } from './socket.gateway';
import { RedisModule } from 'src/db/redisio/redis.module';

@Module({
  imports: [RedisModule],
  providers: [EventsGateway],
})
export class EventsModule {}