import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LikeService } from './like.service';
import { Like, LikeResponse } from './entities/like.entity';
import { User } from 'src/types';
import { SessionUserGraphQl } from 'src/decorator/session.decorator';
import { GqlAuthGuard } from 'src/auth/guard/Gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Like)
export class LikeResolver {
  constructor(private readonly likeService: LikeService) { }
  
  @UseGuards(GqlAuthGuard)
  @Mutation(() => LikeResponse, { name: 'createLike' })
  createLike(@SessionUserGraphQl() user: User, @Args('id', { type: () => String }) postId: string) {
    return this.likeService.create(user, postId);
  }
  @UseGuards(GqlAuthGuard)
  @Mutation(() => LikeResponse, { name: 'destroyLike' })
  destroyLike(@SessionUserGraphQl() user: User, @Args('id', { type: () => String }) postId: string) {
    return this.likeService.remove(user, postId);
  }
  // @Query(() => [Like], { name: 'like' })
  // findAll() {
  //   return this.likeService.findAll();
  // }

  // @Query(() => Like, { name: 'like' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.likeService.findOne(id);
  // }

  // @Mutation(() => Like)
  // updateLike(@Args('updateLikeInput') updateLikeInput: UpdateLikeInput) {
  //   return this.likeService.update(updateLikeInput.id, updateLikeInput);
  // }
}
