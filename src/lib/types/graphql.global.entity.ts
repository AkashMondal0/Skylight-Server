import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GraphQLPageQuery {

  @Field(() => String)
  id: string;

  @Field(() => Number, { nullable: true })
  offset?: number;

  @Field(() => Number, { nullable: true })
  limit?: number;
}
