import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class SearchByUsernameInput {

  @Field(()=>String,)
  Username: string;

  @Field(()=>Number, {nullable:true})
  offset: number;

  @Field(()=>Number, {nullable:true})
  limit: number;
}
