import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class DestroyFriendship {
    @Field(() => String)
    followerUserId: string;
  
    @Field(() => String)
    followingUserId: string;
}
