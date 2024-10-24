import { ObjectType, Field } from '@nestjs/graphql';
import { Comment } from 'src/comment/entities/comment.entity';
import { Assets, PostStatus } from 'src/post/entities/post.entity';
import { Author } from 'src/users/entities/author.entity';

@ObjectType()
export class Story {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  content: string | null;

  @Field(() => [Assets], { nullable: true })
  fileUrl?: Assets[] | null;
  // 
  @Field(() => [String], { nullable: true })
  song?: any[];

  @Field(() => String, { nullable: true })
  createdAt?: Date | unknown;

  @Field(() => String, { nullable: true })
  updatedAt?: Date | unknown ;

  @Field(() => String, { nullable: true })
  authorId?: string;

  @Field(() => Number, { nullable: true })
  viewCount?: number;

  @Field(() => String, { nullable: true })
  expiresAt?: Date;

  // @Field(() => Number, { nullable: true })
  // commentCount?: number;

  // @Field(() => Number, { nullable: true })
  // likeCount?: number;

  // @Field(() => Boolean, { nullable: true })
  // is_Liked?: boolean | unknown | null;

  @Field(() => Author, { nullable: true })
  user?: Author | null | unknown;

  @Field(() => [Comment], { nullable: true })
  comments?: Comment[] | any[];

  @Field(() => [Author], { nullable: true })
  likes?: Author[] | any[];

  // @Field(() => [Author], { nullable: true })
  // top_Like?: Author[] | null;

  @Field(() => [String], { nullable: true })
  status?: PostStatus | string
}