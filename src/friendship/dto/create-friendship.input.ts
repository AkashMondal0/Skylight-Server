import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateFriendshipInput {
  @Field(() => String)
  followerUserId: string;

  @Field(() => String)
  followingUserId: string;

  @Field()
  followerUsername: string;

  @Field()
  followingUsername: string;
}
