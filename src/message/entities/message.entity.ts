import { ObjectType, Field } from '@nestjs/graphql';
import { Author } from 'src/users/entities/author.entity';

@ObjectType()
export class Message {
  @Field(() => String)
  id: string;

  @Field(() => String)
  conversationId: string;

  @Field(() => String, { nullable: true })
  authorId: string | null;

  @Field()
  content: string;

  @Field(() => Author, { nullable: true })
  user?: Author | null;

  @Field(() => [String], { nullable: true })
  fileUrl?: string[] | null;

  @Field(() => Boolean, { nullable: true })
  deleted?: boolean | null;

  @Field(() => [String], { nullable: true })
  seenBy?: string[] | null;

  @Field(() => Date, { nullable: true })
  createdAt?: Date | null;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date | null;
}