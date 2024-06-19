import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateFriendshipInput {

  @Field(()=>String)
  followingUsername: string;

  @Field(()=>String)
  authorUsername: string;
}
