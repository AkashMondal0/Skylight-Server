import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeResolver } from './like.resolver';
import { LikeController } from './like.controller';
import { DrizzleModule } from 'src/db/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  providers: [LikeResolver, LikeService],
  controllers: [LikeController],
})
export class LikeModule {}
