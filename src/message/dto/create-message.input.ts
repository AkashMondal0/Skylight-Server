import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field(() => String, { description: 'Example field (placeholder)' })
  content: string;

  @Field(() => String, { description: 'Example field (placeholder)' })
  authorId: string;

  @Field(() => String, { description: 'Example field (placeholder)' })
  conversationId: string;

  @Field(() => [String], { description: 'Example field (placeholder)' })
  fileUrl: string[];
}
