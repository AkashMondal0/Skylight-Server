import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Friendship {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  followerUserId: string;

  @Field(() => ID)
  followingUserId: string;

  @Field()
  followerUsername: string;

  @Field()
  followingUsername: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}
