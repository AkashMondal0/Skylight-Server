import { ObjectType, Field, ID } from '@nestjs/graphql';
import { AuthorData } from 'src/types/response.type';
import { Author } from 'src/users/entities/author.entity';

@ObjectType()
export class Comment {
  @Field(() => ID)
  id: string;

  @Field()
  comment: string;

  @Field(() => ID)
  authorId: string;

  @Field(() => ID)
  postId: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => Author , { nullable: true })
  user: AuthorData;
}