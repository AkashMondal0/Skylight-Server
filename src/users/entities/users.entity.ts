import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Users {

  @Field(() => String)
  id: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  profilePicture?: string | null

  @Field(() => String, { nullable: true })
  password?: string | null;

  @Field(() => String, { nullable: true })
  bio?: string | null;

  @Field(() => Date, { nullable: true })
  createdAt?: Date | null | unknown; 

  @Field(() => Date, { nullable: true })
  updatedAt?: Date | null | unknown;

  @Field(() => [String], { nullable: true })
  roles?: string[] | null;

  @Field(() => Boolean, { nullable: true })
  isVerified?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  isPrivate?: boolean | null;

  @Field(() => String)
  accessToken?: string | null;

  @Field(() => String)
  refreshToken?: string | unknown;

  @Field(() => String)
  loggedDevice?: any[] | unknown;

  // @Field(() => String)
  // roles?: Role[] | string[];

  @Field(() => String)
  salt?: string;
}