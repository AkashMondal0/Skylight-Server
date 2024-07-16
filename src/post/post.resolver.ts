import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/types';
import { UsersService } from 'src/users/users.service';
import { ProfileView } from 'src/users/entities/profile.entity';
import { SessionUserGraphQl } from 'src/decorator/session.decorator';
import { FriendshipService } from 'src/friendship/friendship.service';
import { GqlAuthGuard } from 'src/auth/guard/Gql-auth.guard';
import { CreatePostInput } from './dto/create-post.input';
import { SearchByUsernameInput } from 'src/friendship/dto/get-friendship.input';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly usersService: UsersService,
    private readonly friendshipService: FriendshipService
  ) { }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Post], { name: 'findProfilePosts' })
  findProfilePosts(@SessionUserGraphQl() user: User, @Args("findPosts") findPosts: SearchByUsernameInput) {
    return this.postService.findAllByProfileName(user, findPosts);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Post], { name: 'feedTimelineConnection' })
  feedTimelineConnection(@SessionUserGraphQl() user: User) {
    return this.friendshipService.feedTimelineConnection(user);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Post, { name: 'findOnePostWithComment' })
  findOnePostWithComment(@SessionUserGraphQl() user: User,@Args('id', { type: () => String }) id: string) {
    return this.postService.findOnePostWithComment(user,id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post, { name: 'createPost' })
  createPost(@SessionUserGraphQl() user: User,@Args('createPostInput') createPostInput: CreatePostInput) {
    return this.postService.createPost(user,createPostInput);
  }
}
