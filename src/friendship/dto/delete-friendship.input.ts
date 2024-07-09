import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class DestroyFriendship {
  
    @Field(()=>String)
    authorUsername: string;
  
    @Field(()=>String)
    authorUserId: string;
  
    @Field(()=>String)
    followingUsername: string;
  
    @Field(()=>String)
    followingUserId: string;
}
