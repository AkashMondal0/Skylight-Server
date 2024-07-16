import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class SearchByUsernameInput {

  @Field(()=>String,)
  username: string;

  @Field(()=>Number, {nullable:true})
  offset: number;

  @Field(()=>Number, {nullable:true})
  limit: number;
}

@InputType()
export class SearchById {

  @Field(()=>String,)
  id: string;

  @Field(()=>Number, {nullable:true})
  offset: number;

  @Field(()=>Number, {nullable:true})
  limit: number;
}
