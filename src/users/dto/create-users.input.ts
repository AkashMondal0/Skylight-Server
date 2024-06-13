import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUsersInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
