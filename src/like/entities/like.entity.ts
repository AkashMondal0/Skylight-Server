import { ObjectType, Field } from '@nestjs/graphql';
import { Author } from 'src/users/entities/author.entity';

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

  @Field(() => Author, { nullable: true })
  user: Author[] | null
}