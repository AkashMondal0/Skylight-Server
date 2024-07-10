import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
import { CreateFriendshipInput } from './dto/create-friendship.input';
import { GraphQLError } from 'graphql';
import { DestroyFriendship } from './dto/delete-friendship.input';
import { and, eq, desc, count, countDistinct, exists } from 'drizzle-orm';
import { Friendship, User } from 'src/types';
import { CommentSchema, FriendshipSchema, LikeSchema, PostSchema, UserSchema } from 'src/db/drizzle/drizzle.schema';
import { AuthorData, PostResponse } from 'src/types/response.type';
import { getFriendshipInput } from './dto/get-friendship.input';

@Injectable()
export class FriendshipService {
  constructor(private readonly drizzleProvider: DrizzleProvider) { }

  async createFriendship(createFollowInput: CreateFriendshipInput): Promise<{ friendShip: boolean } | GraphQLError> {
    try {
      const check = await this.drizzleProvider.db.select().from(FriendshipSchema).where(and(
        eq(FriendshipSchema.followingUserId, createFollowInput.followingUserId),
        eq(FriendshipSchema.authorUserId, createFollowInput.authorUserId),
      ))
        .limit(1)

      if (check.length > 0) {
        throw new GraphQLError('Already following user', {
          extensions: {
            code: "ALREADY_FOLLOWING",
            http: { status: 401 },
          }
        })
      }

      await this.drizzleProvider.db.insert(FriendshipSchema).values({
        followingUsername: createFollowInput.followingUsername,
        authorUsername: createFollowInput.authorUsername,
        authorUserId: createFollowInput.authorUserId,
        followingUserId: createFollowInput.followingUserId,
      })

      return {
        friendShip: true,
      };

    } catch (error) {
      Logger.error(error)
      if (error instanceof GraphQLError) {
        throw error;
      } else {
        throw new GraphQLError('Internal Server Error', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    }
  }

  async deleteFriendship(destroyFriendship: DestroyFriendship): Promise<{ friendShip: boolean } | GraphQLError> {
    try {
      await this.drizzleProvider.db.delete(FriendshipSchema).where(and(
        eq(FriendshipSchema.followingUsername, destroyFriendship.followingUsername),
        eq(FriendshipSchema.authorUsername, destroyFriendship.authorUsername),
      ))

      return {
        friendShip: false,
      }
    } catch (error) {
      Logger.error(error)
      throw new GraphQLError('Error destroy friendship')
    }
  }

  async feedTimelineConnection(loggedUser: User): Promise<PostResponse[]> {
    try {
      if (!loggedUser.id) {
        throw new GraphQLError('User not found', {
          extensions: {
            code: "UNAUTHORIZED_USER",
            http: { status: 401 },
          }
        })
      }
      const data = await this.drizzleProvider.db.select({
        id: PostSchema.id,
        content: PostSchema.content,
        fileUrl: PostSchema.fileUrl,
        commentCount: count(eq(CommentSchema.postId, PostSchema.id)),
        likeCount: countDistinct(eq(LikeSchema.postId, PostSchema.id)),
        createdAt: PostSchema.createdAt,
        updatedAt: PostSchema.updatedAt,
        is_Liked: exists(this.drizzleProvider.db.select().from(LikeSchema).where(and(
          eq(LikeSchema.authorId, loggedUser.id), // <- replace with user id
          eq(LikeSchema.postId, PostSchema.id)
        ))),
        user: {
          id: UserSchema.id,
          username: UserSchema.username,
          email: UserSchema.email,
          profilePicture: UserSchema.profilePicture,
          name: UserSchema.name,
          followed_by: exists(this.drizzleProvider.db.select().from(FriendshipSchema).where(and(
            eq(FriendshipSchema.followingUserId, loggedUser.id),
            eq(FriendshipSchema.authorUserId, UserSchema.id) // <- replace with user id
          ))),
          following: exists(this.drizzleProvider.db.select().from(FriendshipSchema).where(and(
            eq(FriendshipSchema.followingUserId, UserSchema.id), // <- replace with user id
            eq(FriendshipSchema.authorUserId, loggedUser.id)
          ))),
        },
      })
        .from(FriendshipSchema)
        .where(eq(FriendshipSchema.authorUserId, loggedUser.id)) // <- replace with logged in user id
        .limit(12)
        .offset(0)
        .orderBy(desc(PostSchema.createdAt))
        .leftJoin(PostSchema, eq(FriendshipSchema.followingUserId, PostSchema.authorId))
        .leftJoin(CommentSchema, eq(PostSchema.id, CommentSchema.postId))
        .leftJoin(LikeSchema, eq(PostSchema.id, LikeSchema.postId))
        .leftJoin(UserSchema, eq(PostSchema.authorId, UserSchema.id))
        .groupBy(PostSchema.id, UserSchema.id)

      return data;
    } catch (error) {
      Logger.error(error)
      // console.log(error)
      throw new GraphQLError('Error feed Timeline Connection friendship')
    }
  }


  async findAllFollowing(loggedUser: User, Input: getFriendshipInput): Promise<AuthorData[] | GraphQLError> {
    try {
      const data = await this.drizzleProvider.db.select({
        id: UserSchema.id,
        username: UserSchema.username,
        email: UserSchema.email,
        profilePicture: UserSchema.profilePicture,
        name: UserSchema.name,
        followed_by: exists(this.drizzleProvider.db.select()
          .from(FriendshipSchema).where(and(
            eq(FriendshipSchema.authorUsername, Input.Username),
            eq(FriendshipSchema.followingUsername, UserSchema.username),
          ))),
      })
        .from(FriendshipSchema)
        .where(eq(FriendshipSchema.authorUsername, Input.Username),)
        .leftJoin(UserSchema, eq(FriendshipSchema.followingUsername, UserSchema.username))
        .orderBy(desc(FriendshipSchema.createdAt))
        .limit(Input.limit ?? 10)
        .offset(Input.offset ?? 0)

      return data
    } catch (error) {
      Logger.error(error)
      throw new GraphQLError('Error get following')
    }
  }

  async findAllFollower(loggedUser: User, Input: getFriendshipInput): Promise<AuthorData[] | GraphQLError> {
     try {
      const data = await this.drizzleProvider.db.select({
        id: UserSchema.id,
        username: UserSchema.username,
        email: UserSchema.email,
        profilePicture: UserSchema.profilePicture,
        name: UserSchema.name,
        followed_by: exists(this.drizzleProvider.db.select()
          .from(FriendshipSchema).where(and(
            eq(FriendshipSchema.authorUsername, UserSchema.username),
            eq(FriendshipSchema.followingUsername, Input.Username),
          ))),
      })
        .from(FriendshipSchema)
        .where(eq(FriendshipSchema.followingUsername, Input.Username),)
        .leftJoin(UserSchema, eq(FriendshipSchema.authorUsername, UserSchema.username))
        .orderBy(desc(FriendshipSchema.createdAt))
        .limit(Input.limit ?? 10)
        .offset(Input.offset ?? 0)

      return data
    } catch (error) {
      Logger.error(error)
      throw new GraphQLError('Error get following')
    }
  }
}