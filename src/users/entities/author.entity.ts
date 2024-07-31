import { ObjectType, Field, PartialType } from '@nestjs/graphql';
import { Users } from './users.entity';

@ObjectType()
export class Author extends PartialType(Users) {
  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;
  
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  profilePicture: string | null

  @Field(() => Boolean)
  followed_by?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  following?: boolean | null;
}
