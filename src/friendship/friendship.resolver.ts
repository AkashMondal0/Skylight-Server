import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FriendshipService } from './friendship.service';
import { Friendship } from './entities/friendship.entity';
import { CreateFriendshipInput } from './dto/create-friendship.input';
import { DestroyFriendship } from './dto/delete-friendship.input';
import { GqlAuthGuard } from 'src/auth/guard/Gql-auth.guard';
import { UseGuards } from '@nestjs/common';


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

}
