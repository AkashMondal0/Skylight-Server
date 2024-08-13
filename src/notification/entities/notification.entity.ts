import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Comment } from 'src/comment/entities/comment.entity';
import { Post } from 'src/post/entities/post.entity';
import { Author } from 'src/users/entities/author.entity';

export enum NotificationType {
  Like = 'like',
  Comment = 'comment',
  Follow = 'follow',
  Mention = 'mention',
  Reply = 'reply',
  Tag = 'tag',
  Reel = 'reel',
  Story = 'story',
  Post = 'post',
}

@ObjectType()
export class Notification {
  @Field(() => String)
  id: string;

  @Field(() => String)
  type: NotificationType;

  @Field(() => String)
  authorId: string;

  @Field(() => String)
  recipientId: string;

  @Field(() => String, { nullable: true })
  postId?: string;

  @Field(() => Author, { nullable: true })
  author: Author;

  @Field(() => Author, { nullable: true })
  recipient: Author;

  @Field(() => Post, { nullable: true })
  post?: Post;

  @Field(() => Comment, { nullable: true })
  comment?: Comment;

  @Field(() => String, { nullable: true })
  commentId?: string;

  @Field(() => String, { nullable: true })
  storyId?: string;

  @Field(() => String, { nullable: true })
  reelId?: string;

  @Field(() => Date, { nullable: true })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: Date;

  @Field(() => String, { nullable: true })
  seen: boolean;
}
@ObjectType()
export class UnReadNotification {
  @Field(() => Number, { nullable: true })
  unreadCommentCount: number;

  @Field(() => Number, { nullable: true })
  unreadPostCount: number;
}