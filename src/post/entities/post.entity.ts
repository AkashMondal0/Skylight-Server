import { ObjectType, Field } from '@nestjs/graphql';
import { Comment } from 'src/comment/entities/comment.entity';
import { Author } from 'src/users/entities/author.entity';

enum PostStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
}
@ObjectType()
export class Post {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  content: string | null;

  @Field(() => String, { nullable: true })
  title?: string | null;

  @Field(() => [String], { nullable: true })
  fileUrl?: string[] | null;
  // 
  @Field(() => [String], { nullable: true })
  song?: string[];

  @Field(() => [String])
  tags: string[];

  @Field(() => [String])
  locations: string[];

  @Field(() => String, { nullable: true })
  country?: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date | unknown;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date | unknown;

  @Field(() => String, { nullable: true })
  authorId?: string;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => Number, { nullable: true })
  commentCount?: number;

  @Field(() => Number, { nullable: true })
  likeCount?: number;

  @Field(() => Boolean, { nullable: true })
  is_Liked?: boolean | unknown | null;

  @Field(() => Author, { nullable: true })
  user?: Author | null | unknown;

  @Field(() => [Comment], { nullable: true })
  comments?: Comment[] | any[];

  @Field(() => [Author], { nullable: true })
  likes?: Author[] | any[];

  @Field(() => [Author], { nullable: true })
  top_Like?: Author[] | null;

  @Field(() => [String], { nullable: true })
  status?: PostStatus | string
}
