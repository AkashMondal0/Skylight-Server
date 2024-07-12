import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Users } from 'src/users/entities/users.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { User ,LikeType, CommentType} from 'src/types';
import { Author } from 'src/users/entities/author.entity';
import { AuthorData } from 'src/types/response.type';
@ObjectType()
export class Post {
  @Field(() => ID)
  id: string;

  @Field(() => String , { nullable: true })
  content: string;

  @Field(() => String , { nullable: true })
  title?: string;

  @Field(() => [String])
  fileUrl: string[];

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => ID, { nullable: true })
  authorId?: string;

  @Field(() => ID, { nullable: true })
  username?: string;

  @Field(() => Number, { nullable: true })
  commentCount: number;

  @Field(() => Number, { nullable: true })
  likeCount: number;

  @Field(() => Boolean, { nullable: true })
  is_Liked: boolean | unknown;

  @Field(() => Author, { nullable: true })
  user: AuthorData;
  
  @Field(() => [Comment], { nullable: true })
  comments?: CommentType[];

  @Field(() => [Author], { nullable: true })
  likes?: AuthorData[];
  
  @Field(() => [Author], { nullable: true })
  top_Like: AuthorData[];
}