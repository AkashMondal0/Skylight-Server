import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Friendship {

  @Field(() => Boolean, { nullable: true })
  following?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  followed_by?: boolean | null;

  @Field(() => String, { nullable: true })
  status?: string | null;

  @Field(() => Boolean, { nullable: true })
  isFeedFavorite: boolean | null;

  @Field(() => Boolean, { nullable: true })
  isCloseFriends: boolean | null;

  @Field(() => Boolean, { nullable: true })
  blocking: boolean | null;

  @Field(() => Boolean, { nullable: true })
  isRestricted: boolean | null;

  @Field(() => Boolean, { nullable: true })
  notificationPost: boolean | null;

  @Field(() => Boolean, { nullable: true })
  notificationStory: boolean | null;

  @Field(() => Boolean, { nullable: true })
  isNotificationReel: boolean | null;

  @Field(() => Boolean, { nullable: true })
  isMutingNotification: boolean | null;

  @Field(() => Boolean, { nullable: true })
  isMutingPost: boolean | null;

  @Field(() => Boolean, { nullable: true })
  isMutingStory: boolean | null;

  @Field(() => Boolean, { nullable: true })
  isMutingReel: boolean | null;

  @Field(() => Boolean, { nullable: true })
  outgoingRequest: boolean | null;

  @Field(() => Boolean, { nullable: true })
  incomingRequest: boolean | null;
}