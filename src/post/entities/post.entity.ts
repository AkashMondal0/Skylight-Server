import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Users } from 'src/users/entities/users.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { User ,LikeType, CommentType} from 'src/types';
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

  @Field(() => Number, { nullable: true })
  commentCount: number;

  @Field(() => Number, { nullable: true })
  likeCount: number;

  @Field(() => Boolean, { nullable: true })
  alreadyLiked: boolean | unknown;

  @Field(() => [Comment], { nullable: true })
  comments: CommentType[];

  @Field(() => [Users], { nullable: true })
  likes: LikeType[];

  @Field(() => Users, { nullable: true })
  user: User;
}