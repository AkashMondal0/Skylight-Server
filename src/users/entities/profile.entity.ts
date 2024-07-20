import { ObjectType, Field, PartialType } from '@nestjs/graphql';
import { Author } from './author.entity';
import { Users } from './users.entity';
import { Friendship } from 'src/friendship/entities/friendship.entity';


@ObjectType()
export class Profile extends PartialType(Users) {

  @Field(() => Number, { nullable: true })
  postCount: number;

  @Field(() => Number, { nullable: true })
  followerCount: number;

  @Field(() => Number, { nullable: true })
  followingCount: number;

  @Field(() => Friendship, { nullable: true })
  friendship?: Friendship | unknown;

  @Field(() => [Author], { nullable: true })
  top_followers?: Author[] | null;
}