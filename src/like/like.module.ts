import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeResolver } from './like.resolver';
import { LikeController } from './like.controller';

@Module({
  providers: [LikeResolver, LikeService],
  controllers: [LikeController],
})
export class LikeModule {}
