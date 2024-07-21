import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Message } from './entities/message.entity';
import { SessionUserGraphQl } from 'src/decorator/session.decorator';
import { Author } from 'src/users/entities/author.entity';
import { GraphQLPageQuery } from 'src/lib/types/graphql.global.entity';
import { CreateMessageInput } from './dto/create-message.input';
import { GqlAuthGuard } from 'src/auth/guard/Gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) { }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Message)
  createMessage(@SessionUserGraphQl() user: Author, @Args('createMessageInput') createMessageInput: CreateMessageInput) {
    return this.messageService.create(user,createMessageInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Message], { name: 'findAllMessages' })
  findAllMessages(@SessionUserGraphQl() user: Author, @Args('graphQLPageQuery') graphQLPageQuery: GraphQLPageQuery) {
    return this.messageService.findAll(user, graphQLPageQuery);
  }

  // @Query(() => Message, { name: 'message' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.messageService.findOne(id);
  // }

  // @Mutation(() => Message)
  // updateMessage(@Args('updateMessageInput') updateMessageInput: UpdateMessageInput) {
  //   return this.messageService.update(updateMessageInput.id, updateMessageInput);
  // }

  // @Mutation(() => Message)
  // removeMessage(@Args('id', { type: () => Int }) id: number) {
  //   return this.messageService.remove(id);
  // }
}
