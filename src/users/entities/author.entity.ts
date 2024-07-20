import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Author {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  username?: string | null;

  @Field(() => String, { nullable: true })
  email?: string | null;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => String, { nullable: true })
  profilePicture?: string | null;

  @Field(() => Boolean, { nullable: true })
  followed_by?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  following?: boolean | null;
}


