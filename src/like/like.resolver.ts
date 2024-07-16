import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LikeService } from './like.service';
import { Like, LikeResponse } from './entities/like.entity';
import { User } from 'src/types';
import { SessionUserGraphQl } from 'src/decorator/session.decorator';
import { GqlAuthGuard } from 'src/auth/guard/Gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { SearchById } from 'src/friendship/dto/get-friendship.input';
import { Author } from 'src/users/entities/author.entity';

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

  @UseGuards(GqlAuthGuard)
  @Query(() => [Author], { name: 'findAllLikes' })
  findAllLikes(@SessionUserGraphQl() user: User, @Args('findAllLikesInput') findAllLikesInput: SearchById) {
    return this.likeService.findAll(user, findAllLikesInput);
  }

  // @Query(() => Like, { name: 'like' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.likeService.findOne(id);
  // }

  // @Mutation(() => Like)
  // updateLike(@Args('updateLikeInput') updateLikeInput: UpdateLikeInput) {
  //   return this.likeService.update(updateLikeInput.id, updateLikeInput);
  // }
}
