import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FriendshipService } from './friendship.service';
import { Friendship } from './entities/friendship.entity';
import { CreateFriendshipInput } from './dto/create-friendship.input';
import { DestroyFriendship } from './dto/delete-friendship.input';
import { GqlAuthGuard } from 'src/auth/guard/Gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Author } from 'src/users/entities/author.entity';
import { User } from 'src/types';
import { SessionUserGraphQl } from 'src/decorator/session.decorator';
import { SearchByUsernameInput } from './dto/get-friendship.input';


@Resolver(() => Friendship)
export class FriendshipResolver {
  constructor(private readonly friendshipService: FriendshipService) { }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Friendship, { name: 'createFriendship' })
  createFriendship(@Args('createFriendshipInput') createFriendshipInput: CreateFriendshipInput) {
    return this.friendshipService.createFriendship(createFriendshipInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Friendship, { name: 'destroyFriendship' })
  destroyFriendship(@Args('destroyFriendship') destroyFriendship: DestroyFriendship) {
    return this.friendshipService.deleteFriendship(destroyFriendship);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Author], { name: 'viewFollower' })
  viewFollower(@SessionUserGraphQl() user: User, @Args('viewFollowerInput') viewFollower: SearchByUsernameInput) {
    return this.friendshipService.findAllFollower(user, viewFollower);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Author], { name: 'viewFollowing' })
  viewFollowing(@SessionUserGraphQl() user: User, @Args('viewFollowingInput') viewFollowing: SearchByUsernameInput) {
    return this.friendshipService.findAllFollowing(user, viewFollowing);
  }
}
