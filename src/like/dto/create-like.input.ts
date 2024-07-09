import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateLikeInput {
  @Field(() => String, { description: 'Example field (placeholder)' })
  postId: string;
}
