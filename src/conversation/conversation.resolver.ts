import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ConversationService } from './conversation.service';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationInput } from './dto/create-conversation.input';
import { GqlAuthGuard } from 'src/auth/guard/Gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { SessionUserGraphQl } from 'src/decorator/session.decorator';
import { Author } from 'src/users/entities/author.entity';


@Resolver(() => Conversation)
export class ConversationResolver {
  constructor(private readonly conversationService: ConversationService) { }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Conversation, { name: 'createConversation' })
  createConversation(
    @SessionUserGraphQl() user: Author,
    @Args('createConversationInput') createConversationInput: CreateConversationInput) {
    return this.conversationService.create(user, createConversationInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Conversation], { name: 'findAllConversation' })
  findAllConversation(@SessionUserGraphQl() user: Author) {
    return this.conversationService.findAll(user);
  }

  // @UseGuards(GqlAuthGuard)
  // @Query(() => AuthorConversation, { name: 'findOneConversation' })
  // findOneConversation(@Args('id', { type: () => String }) id: string) {
  //   return this.conversationService.findOne(id);
  // }

  // @Mutation(() => Conversation)
  // updateConversation(@Args('updateConversationInput') updateConversationInput: UpdateConversationInput) {
  //   return this.conversationService.update(updateConversationInput.id, updateConversationInput);
  // }

  // @Mutation(() => Conversation)
  // removeConversation(@Args('id', { type: () => Int }) id: number) {
  //   return this.conversationService.remove(id);
  // }
}
