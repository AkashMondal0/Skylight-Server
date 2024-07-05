import { ObjectType, Field, ID} from '@nestjs/graphql';

@ObjectType()
export class ProfileFriendship {
  
    @Field(() => String, { nullable: true })
    status: string;

    @Field(() => Boolean, { nullable: true })
    following: boolean;

    @Field(() => Boolean, { nullable: true })
    followed_by: boolean;
  
    @Field(() => Boolean, { nullable: true })
    isFeedFavorite: boolean;
  
    @Field(() => Boolean, { nullable: true })
    isCloseFriends: boolean;
  
    @Field(() => Boolean, { nullable: true })
    blocking: boolean;
  
    @Field(() => Boolean, { nullable: true })
    isRestricted: boolean;
  
    @Field(() => Boolean, { nullable: true })
    notificationPost: boolean;
  
    @Field(() => Boolean, { nullable: true })
    notificationStory: boolean;
  
    @Field(() => Boolean, { nullable: true })
    isNotificationReel: boolean;
  
    @Field(() => Boolean, { nullable: true })
    isMutingNotification: boolean;
  
    @Field(() => Boolean, { nullable: true })
    isMutingPost: boolean;
  
    @Field(() => Boolean, { nullable: true })
    isMutingStory: boolean;
  
    @Field(() => Boolean, { nullable: true })
    isMutingReel: boolean;
  
    @Field(() => Boolean, { nullable: true })
    outgoingRequest: boolean;
  
    @Field(() => Boolean, { nullable: true })
    incomingRequest: boolean;
  }