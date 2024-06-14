import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { PostController } from './post.controller';
import { DrizzleModule } from 'src/db/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  providers: [PostResolver, PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule { }
