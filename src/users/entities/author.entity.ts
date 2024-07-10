import { ObjectType, Field, ID} from '@nestjs/graphql';

@ObjectType()
export class Author {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  username: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  profilePicture?: string;

  @Field(() => Boolean, { nullable: true })
  followed_by?: boolean;

  @Field(() => Boolean, { nullable: true })
  following?: boolean;
}


