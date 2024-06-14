import { ObjectType, Field, ID } from '@nestjs/graphql';

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
}