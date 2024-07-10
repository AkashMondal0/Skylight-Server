import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class getFriendshipInput {

  @Field(()=>String)
  Username: string;

  @Field(()=>Number)
  offset: number;

  @Field(()=>Number)
  limit: number;
}
