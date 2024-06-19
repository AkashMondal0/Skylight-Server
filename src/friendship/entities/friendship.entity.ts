import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Friendship {
  @Field(() => ID)
  id: string;

  @Field(()=>String)
  authorUsername: string;

  @Field(()=>String)
  followingUsername: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}
