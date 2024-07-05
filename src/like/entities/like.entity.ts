import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/types';
import { Users } from 'src/users/entities/users.entity';

@ObjectType()
export class Like {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  authorId: string;

  @Field(() => ID)
  postId: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => Boolean, { nullable: true })
  alreadyLiked: boolean | unknown;

  @Field(() => Users, { nullable: true })
  user: User[]
}