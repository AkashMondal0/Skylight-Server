import { ObjectType, Field } from '@nestjs/graphql';
import { Users } from 'src/users/entities/users.entity';

@ObjectType()
export class Like {
  @Field(() => String)
  id: string;

  @Field(() => String)
  authorId: string;

  @Field(() => String)
  postId: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date | null;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date | null;

  @Field(() => Boolean, { nullable: true })
  alreadyLiked?: boolean | null;

  @Field(() => Users, { nullable: true })
  user?: Users[] | null
}