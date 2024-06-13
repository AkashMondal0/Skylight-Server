import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { PostController } from './post.controller';

@Module({
  providers: [PostResolver, PostService],
  controllers: [PostController],
})
export class PostModule {}
