import { Module } from '@nestjs/common';
import { StoryResolver } from './story.resolver';
import { StoryController } from './story.controller';
import { DrizzleModule } from 'src/db/drizzle/drizzle.module';
import { UsersService } from 'src/users/users.service';
import { FriendshipService } from 'src/friendship/friendship.service';
import { StoryService } from './story.service';
import { RedisModule } from 'src/db/redis/redis.module';

@Module({
  imports: [DrizzleModule,RedisModule],
  providers: [StoryResolver, StoryService, UsersService, FriendshipService],
  controllers: [StoryController],
  exports: [StoryService],
})
export class StoryModule { }
