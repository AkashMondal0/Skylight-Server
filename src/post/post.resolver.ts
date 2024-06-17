import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guard/Gql-auth.guard';
import { CurrentUser } from 'src/auth/graphql/CurrentUser';
import { User } from 'src/types';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) { }

  // @Mutation(() => Post)
  // createPost(@Args('createPostInput') createPostInput: CreatePostInput) {
  //   return this.postService.create(createPostInput);
  // }
  @UseGuards(GqlAuthGuard)
  @Query(() => [Post], { name: 'posts' })
  findAll() {
    return this.postService.findAll();
  }

  @Query(() => Post, { name: 'post' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.postService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Post], { name: 'profileFeed' })
  profileFeed(
    @CurrentUser() session: User,
    @Args('limit', { type: () => Int }) limit: number,
    @Args('offset', { type: () => Int }) offset: number
  ) {
    return this.postService.postTimelineConnection(session.id, limit, offset);
  }

  // @Mutation(() => Post)
  // updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
  //   return this.postService.update(updatePostInput.id, updatePostInput);
  // }

  // @Mutation(() => Post)
  // removePost(@Args('id', { type: () => Int }) id: number) {
  //   return this.postService.remove(id);
  // }
}
