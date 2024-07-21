import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { SessionUserGraphQl } from 'src/decorator/session.decorator';
import { GqlAuthGuard } from 'src/auth/guard/Gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { GraphQLPageQuery } from 'src/lib/types/graphql.global.entity';
import { Author } from 'src/users/entities/author.entity';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) { }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment, { name: 'createComment' })
  createComment(@SessionUserGraphQl() user: Author, @Args('createCommentInput') createCommentInput: CreateCommentInput) {
    return this.commentService.create(user, createCommentInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Comment], { name: 'findComments' })
  findAll(@SessionUserGraphQl() user: Author, @Args('createCommentInput') findCommentInput: GraphQLPageQuery) {
    return this.commentService.findAll(user, findCommentInput);
  }
  
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment, { name: 'updateComment' })
  updateComment(@SessionUserGraphQl() user: Author,@Args('updateCommentInput') updateCommentInput: UpdateCommentInput) {
    return this.commentService.update(user, updateCommentInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment, { name: 'destroyComment' })
  removeComment(@SessionUserGraphQl() user: Author,@Args('id', { type: () => String }) id: string) {
    return this.commentService.remove(user, id);
  }
}
