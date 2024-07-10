import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class FindCommentInput {
  @Field(() => String, { description: 'Example field (placeholder)' })
  postId: string;

  @Field(() => Number, { description: 'Example field (placeholder)' })
  offset: number;

  @Field(() => Number, { description: 'Example field (placeholder)' })
  limit: number;

}
