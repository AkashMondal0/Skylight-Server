import { InputType, Int, Field } from '@nestjs/graphql';
import { NotificationType } from '../entities/notification.entity';

@InputType()
export class CreateNotificationInput {
  @Field(() => String)
  type: NotificationType;

  @Field(() => String)
  authorId: string;

  @Field(() => String)
  recipientId: string;

  @Field(() => String, { nullable: true })
  postId: string;

  @Field(() => String, { nullable: true })
  commentId?: string;

  @Field(() => String, { nullable: true })
  storyId?: string;

  @Field(() => String, { nullable: true })
  reelId?: string;
}