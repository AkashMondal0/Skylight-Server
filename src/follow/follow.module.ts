import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowResolver } from './follow.resolver';
import { FollowController } from './follow.controller';

@Module({
  providers: [FollowResolver, FollowService],
  controllers: [FollowController],
})
export class FollowModule {}
