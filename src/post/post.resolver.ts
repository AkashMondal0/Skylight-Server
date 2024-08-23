import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { UseGuards } from '@nestjs/common';
import { SessionUserGraphQl } from 'src/decorator/session.decorator';
import { GqlAuthGuard } from 'src/auth/guard/Gql-auth.guard';
import { CreatePostInput } from './dto/create-post.input';
import { GraphQLPageQuery } from 'src/lib/types/graphql.global.entity';
import { Author } from 'src/users/entities/author.entity';
import { GqlRolesGuard } from 'src/auth/guard/Gql.roles.guard';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly postService: PostService
  ) { }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Post], { name: 'feedTimelineConnection' })
  feedTimelineConnection(@SessionUserGraphQl() user: Author, @Args("limitAndOffset") limitAndOffset: GraphQLPageQuery) {
    return this.postService.feed(user, limitAndOffset);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Post], { name: 'findAllPosts' })
  findPosts(@SessionUserGraphQl() user: Author, @Args("findAllPosts") findPosts: GraphQLPageQuery) {
    return this.postService.findPosts(user, findPosts);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Post, { name: 'findOnePost' })
  findOnePost(@SessionUserGraphQl() user: Author, @Args('id', { type: () => String }) id: string) {
    return this.postService.findOnePost(user, id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post, { name: 'createPost' })
  createPost(@SessionUserGraphQl() user: Author, @Args('createPostInput') createPostInput: CreatePostInput) {
    return this.postService.createPost(user, createPostInput);
  }

  // @UseGuards(GqlAuthGuard)
  // @Mutation(() => Post, { name: 'updatePost' })
  // updatePost(@SessionUserGraphQl() user: Author, @Args('createPostInput') createPostInput: CreatePostInput) {
  //   return this.postService.createPost(user, createPostInput);
  // }

  // @UseGuards(GqlAuthGuard)
  // @Mutation(() => Post, { name: 'deletePost' })
  // deletePost(@SessionUserGraphQl() user: Author, @Args('createPostInput') createPostInput: CreatePostInput) {
  //   return this.postService.createPost(user, createPostInput);
  // }
}
