import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationResolver } from './conversation.resolver';
import { ConversationController } from './conversation.controller';
import { RedisModule } from 'src/db/redisio/redis.module';
import { DrizzleModule } from 'src/db/drizzle/drizzle.module';

@Module({
  imports: [RedisModule, DrizzleModule],
  providers: [ConversationResolver, ConversationService],
  controllers: [ConversationController],
})
export class ConversationModule { }
