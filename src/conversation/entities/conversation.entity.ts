import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Conversation {
  @Field(() => ID)
  id: string;

  @Field(() => [String])
  members: string[];

  @Field()
  isGroup: boolean;

  @Field({ nullable: true })
  groupName?: string;

  @Field({ nullable: true })
  groupImage?: string;

  @Field({ nullable: true })
  groupDescription?: string;

  @Field(() => ID)
  authorId: string;

  @Field()
  lastMessageContent: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}
