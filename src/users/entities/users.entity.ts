import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Role } from 'src/types';

@ObjectType()
export class Users {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  profilePicture?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => [String], { nullable: true })
  roles?: string[];

  @Field({ nullable: true })
  isVerified?: boolean;

  @Field({ nullable: true })
  isPrivate?: boolean;
}

