import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { MessageController } from './message.controller';
import { RedisModule } from 'src/db/redis/redis.module';
import { DrizzleModule } from 'src/db/drizzle/drizzle.module';

@Module({
  imports: [RedisModule, DrizzleModule],
  providers: [MessageResolver, MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
