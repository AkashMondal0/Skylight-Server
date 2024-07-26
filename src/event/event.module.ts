import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { EventService } from './event.service';
import { RedisModule } from 'src/db/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [EventGateway, EventService],
  exports: [EventGateway],
})
export class EventsModule { }