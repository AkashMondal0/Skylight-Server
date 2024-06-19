import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class DestroyFriendship {
    @Field(()=>String)
    followingUsername: string;
  
    @Field(()=>String)
    authorUsername: string;
}
