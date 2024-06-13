import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Users {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
