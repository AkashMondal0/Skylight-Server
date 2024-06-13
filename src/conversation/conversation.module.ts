import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationResolver } from './conversation.resolver';
import { ConversationController } from './conversation.controller';

@Module({
  providers: [ConversationResolver, ConversationService],
  controllers: [ConversationController],
})
export class ConversationModule {}
