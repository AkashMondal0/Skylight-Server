import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Message {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field(() => [String])
  fileUrl: string[];

  @Field(() => ID)
  authorId: string;

  @Field()
  deleted: boolean;

  @Field(() => [String])
  seenBy: string[];

  @Field(() => ID)
  conversationId: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}