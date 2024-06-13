import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Explore {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
