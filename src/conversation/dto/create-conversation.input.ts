import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateConversationInput {
  @Field(() => String, { description: 'Example field (placeholder)', nullable: true })
  authorId?: string;

  @Field(() => [String], { description: 'Example field (placeholder)' })
  memberIds: string[];

  @Field(() => Boolean, { description: 'Example field (placeholder)' })
  isGroup: boolean;

  @Field(() => String, { description: 'Example field (placeholder)', nullable: true })
  groupName: string;

  @Field(() => String, { description: 'Example field (placeholder)', nullable: true })
  groupDescription: string;

  @Field(() => String, { description: 'Example field (placeholder)', nullable: true })
  groupImage: string;
}
