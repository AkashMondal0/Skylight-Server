import { ObjectType, Field, InputType } from '@nestjs/graphql';

@InputType()
export class GraphQLPageQuery {

  @Field(() => String)
  id: string;

  @Field(() => Number, { nullable: true })
  offset?: number;

  @Field(() => Number, { nullable: true })
  limit?: number;
}
@ObjectType()
class User_Schema {
  @Field(() => String)
  id: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  profilePicture?: string;

  @Field(() => String, { nullable: true })
  bio?: string;

  @Field(() => [String], { nullable: true })
  website?: string[];
}

@ObjectType()
class Account_Schema {
  @Field(() => String)
  id: string;

  @Field(() => Boolean)
  isVerified: boolean;

  @Field(() => Boolean)
  isPrivate: boolean;

  @Field(() => [String])
  roles: string[];

  @Field(() => String, { nullable: true })
  location?: string;

  @Field(() => Number, { nullable: true })
  phone?: number;

  @Field(() => String, { nullable: true })
  locale?: string;

  @Field(() => Number)
  timeFormat: number;

  @Field(() => Boolean)
  locked: boolean;

  @Field(() => Date, { nullable: true })
  accessTokenExpires?: Date;

  @Field(() => [String], { nullable: true })
  accessToken?: string[];

  @Field(() => [String], { nullable: true })
  refreshToken?: string[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
class UserSettings_Schema {
  @Field(() => String)
  id: string;

  @Field(() => String)
  theme: string;
}

@ObjectType()
class UserPassword_Schema {
  @Field(() => String)
  id: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  hash: string;
}

@ObjectType()
class Session_Schema {
  @Field(() => String)
  id: string;

  @Field(() => String)
  sessionToken: string;

  @Field(() => Date)
  expires: Date;
}

@ObjectType()
class Friendship_Schema {
  @Field(() => String)
  followingUsername: string;

  @Field(() => String)
  followingUserId: string;

  @Field(() => String)
  authorUsername: string;

  @Field(() => String)
  authorUserId: string;

  @Field(() => String)
  status: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Boolean)
  isFeedFavorite: boolean;

  @Field(() => Boolean)
  isCloseFriends: boolean;

  @Field(() => Boolean)
  blocking: boolean;

  @Field(() => Boolean)
  isRestricted: boolean;

  @Field(() => Boolean)
  notificationPost: boolean;

  @Field(() => Boolean)
  notificationStory: boolean;

  @Field(() => Boolean)
  isNotificationReel: boolean;

  @Field(() => Boolean)
  isMutingNotification: boolean;

  @Field(() => Boolean)
  isMutingPost: boolean;

  @Field(() => Boolean)
  isMutingStory: boolean;

  @Field(() => Boolean)
  isMutingReel: boolean;

  @Field(() => Boolean)
  outgoingRequest: boolean;

  @Field(() => Boolean)
  incomingRequest: boolean;
}

@ObjectType()
class Post_Schema {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  content?: string;

  @Field(() => [String], { nullable: true })
  fileUrl?: string[];

  @Field(() => String)
  authorId: string;

  @Field(() => String)
  status: string;

  @Field(() => Date)
  createdAt: Date;

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

  @Field(() => [String])
  likes: string[];

  @Field(() => [String])
  comments: string[];

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
class Comment_Schema {
  @Field(() => String)
  id: string;

  @Field(() => String)
  content: string;

  @Field(() => [String])
  mentionUsername: string[];

  @Field(() => String)
  authorId: string;

  @Field(() => String)
  postId: string;

  @Field(() => [String])
  tagsUsername: string[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
class Like_Schema {
  @Field(() => String)
  id: string;

  @Field(() => String)
  authorId: string;

  @Field(() => String, { nullable: true })
  postId?: string;

  @Field(() => String, { nullable: true })
  commentId?: string;

  @Field(() => Date)
  createdAt: Date;
}

@ObjectType()
class Story_Schema {
  @Field(() => String)
  id: string;

  @Field(() => String)
  authorId: string;

  @Field(() => String)
  content: string;

  @Field(() => String, { nullable: true })
  mediaUrl?: string;

  @Field(() => [String])
  song: string[];

  @Field(() => Number)
  viewCount: number;

  @Field(() => Date)
  expiresAt: Date;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => String)
  status: string;

  @Field(() => [String])
  likes: string[];

  @Field(() => [String])
  comments: string[];
}

@ObjectType()
class Reel {
  @Field(() => String)
  id: string;

  @Field(() => String)
  authorId: string;

  @Field(() => String, { nullable: true })
  caption?: string;

  @Field(() => String)
  videoUrl: string;

  @Field(() => Number)
  likeCount: number;

  @Field(() => Number)
  commentCount: number;

  @Field(() => String)
  status: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => [String])
  likes: string[];

  @Field(() => [String])
  comments: string[];
}

@ObjectType()
class CommentReply_Schema {
  @Field(() => String)
  id: string;

  @Field(() => String)
  content: string;

  @Field(() => [String])
  mentionUsername: string[];

  @Field(() => String)
  authorId: string;

  @Field(() => String)
  commentId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
class Message_Schema {
  @Field(() => String)
  id: string;

  @Field(() => String)
  content: string;

  @Field(() => [String], { nullable: true })
  fileUrl?: string[];

  @Field(() => String)
  authorId: string;

  @Field(() => Boolean)
  deleted: boolean;

  @Field(() => [String], { nullable: true })
  seenBy?: string[];

  @Field(() => String)
  conversationId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
class Conversation_Schema {
  @Field(() => String)
  id: string;

  @Field(() => [String])
  members: string[];

  @Field(() => String, { nullable: true })
  userId?: string;

  @Field(() => String)
  authorId: string;

  @Field(() => Boolean)
  isGroup: boolean;

  @Field(() => String, { nullable: true })
  groupName?: string;

  @Field(() => String, { nullable: true })
  groupImage?: string;

  @Field(() => String, { nullable: true })
  groupDescription?: string;

  @Field(() => String, { nullable: true })
  lastMessageContent?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => [String])
  messages: string[];
}