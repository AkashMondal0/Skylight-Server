import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FriendshipService } from './friendship.service';
import { Friendship } from './entities/friendship.entity';
import { CreateFriendshipInput } from './dto/create-friendship.input';
import { DestroyFriendship } from './dto/delete-friendship.input';
import { GqlAuthGuard } from 'src/auth/guard/Gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { SessionUserGraphQl } from 'src/decorator/session.decorator';
import { User } from 'src/types';

@Resolver(() => Friendship)
export class FriendshipResolver {
  constructor(private readonly friendshipService: FriendshipService) { }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Friendship, { name: 'createFriendship' })
  createFriendship(@Args('createFriendshipInput') createFriendshipInput: CreateFriendshipInput) {
    return this.friendshipService.create(createFriendshipInput);
  }

  @Query(() => [Friendship], { name: 'feedTimelineConnection' })
  feedTimelineConnection(@SessionUserGraphQl() user: User) {
    return this.friendshipService.feedTimelineConnection(user.id);
  }

  // @Query(() => Friendship, { name: 'friendship' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.friendshipService.findOne(id);
  // }

  // @Mutation(() => Friendship)
  // updateFriendship(@Args('updateFriendshipInput') updateFriendshipInput: UpdateFriendshipInput) {
  //   return this.friendshipService.update(updateFriendshipInput.id, updateFriendshipInput);
  // }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Friendship, { name: 'destroyFriendship' })
  destroyFriendship(@Args('destroyFriendship') destroyFriendship: DestroyFriendship) {
    // return this.friendshipService.deleteFriendship(destroyFriendship);
  }
}
