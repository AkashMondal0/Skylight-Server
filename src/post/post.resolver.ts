import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { UseGuards } from '@nestjs/common';
import { SessionUserGraphQl } from 'src/decorator/session.decorator';
import { FriendshipService } from 'src/friendship/friendship.service';
import { GqlAuthGuard } from 'src/auth/guard/Gql-auth.guard';
import { CreatePostInput } from './dto/create-post.input';
import { GraphQLPageQuery } from 'src/lib/types/graphql.global.entity';
import { Author } from 'src/users/entities/author.entity';
import { GqlRolesGuard } from 'src/auth/guard/Gql.roles.guard';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly friendshipService: FriendshipService
  ) { }

  @UseGuards(GqlRolesGuard)
  @Query(() => [Post], { name: 'findProfilePosts' })
  findProfilePosts(@SessionUserGraphQl() user: Author, @Args("findPosts") findPosts: GraphQLPageQuery) {
    return this.postService.findProfilePosts(user, findPosts);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Post], { name: 'feedTimelineConnection' })
  feedTimelineConnection(@SessionUserGraphQl() user: Author) {
    return this.friendshipService.feedTimelineConnection(user);
  }

  @UseGuards(GqlRolesGuard)
  @Query(() => Post, { name: 'findOnePostWithComment' })
  findOnePostWithComment(@SessionUserGraphQl() user: Author,@Args('id', { type: () => String }) id: string) {
    return this.postService.findOnePostWithComment(user,id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post, { name: 'createPost' })
  createPost(@SessionUserGraphQl() user: Author,@Args('createPostInput') createPostInput: CreatePostInput) {
    return this.postService.createPost(user,createPostInput);
  }
}
