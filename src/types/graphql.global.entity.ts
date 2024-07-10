import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class GraphQLOperation {

  @Field(() => Boolean)
  status: boolean;

  @Field(() => String, { nullable: true })
  message?: string;
}
