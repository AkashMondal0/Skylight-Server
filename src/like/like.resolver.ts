import { Resolver, Query, Mutation, Args} from '@nestjs/graphql';
import { LikeService } from './like.service';
import { Like } from './entities/like.entity';
import { SessionUserGraphQl } from 'src/decorator/session.decorator';
import { GqlAuthGuard } from 'src/auth/guard/Gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Author } from 'src/users/entities/author.entity';
import { GraphQLPageQuery } from 'src/types/graphql.global.entity';

@Resolver(() => Like)
export class LikeResolver {
  constructor(private readonly likeService: LikeService) { }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Like, { name: 'createLike' })
  createLike(@SessionUserGraphQl() user: Author, @Args('id', { type: () => String }) postId: string) {
    return this.likeService.create(user, postId);
  }
  
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Like, { name: 'destroyLike' })
  destroyLike(@SessionUserGraphQl() user: Author, @Args('id', { type: () => String }) postId: string) {
    return this.likeService.remove(user, postId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Author], { name: 'findAllLikes' })
  findAllLikes(@SessionUserGraphQl() user: Author, @Args('findAllLikesInput') findAllLikesInput: GraphQLPageQuery) {
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
