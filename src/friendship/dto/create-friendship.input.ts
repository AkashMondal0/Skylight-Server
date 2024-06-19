import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateFriendshipInput {

  @Field(()=>String)
  authorUsername: string;

  @Field(()=>String)
  authorUserId: string;

  @Field(()=>String)
  followingUsername: string;

  @Field(()=>String)
  followingUserId: string;
}
