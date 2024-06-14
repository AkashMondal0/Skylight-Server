import { ObjectType, Field, ID } from '@nestjs/graphql';
@ObjectType()
export class Post {
  @Field(() => ID)
  id: string;

  @Field()
  caption: string;

  @Field(() => [String])
  fileUrl: string[];

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => ID)
  authorId: string;

  @Field(() => ID)
  postId: string;
}