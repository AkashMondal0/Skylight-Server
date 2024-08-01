import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Author {
  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  id: string;

  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  profilePicture: string | null

  @Field(() => Boolean, { nullable: true })
  followed_by?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  following?: boolean | null;
}
