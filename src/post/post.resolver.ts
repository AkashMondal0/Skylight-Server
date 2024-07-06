import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/types';
import { UsersService } from 'src/users/users.service';
import { ProfileView } from 'src/users/entities/profile.entity';
import { SessionUserGraphQl } from 'src/decorator/session.decorator';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly usersService: UsersService
  ) { }

  // @UseGuards(GqlAuthGuard)
  // @Query(() => ProfileView, { name: 'profileView' })
  // findProfile(@SessionUserGraphQl() user: User, @Args('username', { type: () => String }) username: string) {
  //   return this.usersService.findProfile(user, username);
  // }
}
