import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
import { CreateFriendshipInput } from './dto/create-friendship.input';
import { GraphQLError } from 'graphql';
import { DestroyFriendship } from './dto/delete-friendship.input';
import { and, eq, desc, count, countDistinct, exists } from 'drizzle-orm';
import { Friendship, User } from 'src/types';
import { CommentSchema, FriendshipSchema, LikeSchema, PostSchema, UserSchema } from 'src/db/drizzle/drizzle.schema';
import { AuthorData, PostResponse } from 'src/types/response.type';
import { SearchByUsernameInput } from './dto/get-friendship.input';

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
      throw new GraphQLError('Internal Server Error', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' }
      });
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
      throw new GraphQLError('Internal Server Error', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' }
      });
    }
  }

  async feedTimelineConnection(loggedUser: User): Promise<PostResponse[]> {
    try {
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
        .innerJoin(PostSchema, eq(FriendshipSchema.followingUserId, PostSchema.authorId))
        .leftJoin(CommentSchema, eq(PostSchema.id, CommentSchema.postId))
        .leftJoin(LikeSchema, eq(PostSchema.id, LikeSchema.postId))
        .innerJoin(UserSchema, eq(PostSchema.authorId, UserSchema.id))
        .groupBy(PostSchema.id, UserSchema.id) 
      return data;
    } catch (error) {
      Logger.error(error)
      throw new GraphQLError('Internal Server Error', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' }
      });
    }
  }

  async findAllFollowing(loggedUser: User, Input: SearchByUsernameInput): Promise<AuthorData[] | GraphQLError> {
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
            eq(FriendshipSchema.followingUsername, loggedUser.username),
          ))),
        following: exists(this.drizzleProvider.db.select()
          .from(FriendshipSchema).where(and(
            eq(FriendshipSchema.authorUsername, loggedUser.username),
            eq(FriendshipSchema.followingUsername, UserSchema.username),
          ))),
      })
        .from(FriendshipSchema)
        .where(eq(FriendshipSchema.authorUsername, Input.username),)
        .leftJoin(UserSchema, eq(FriendshipSchema.followingUsername, UserSchema.username))
        .orderBy(desc(FriendshipSchema.createdAt))
        .limit(Number(Input.limit) ?? 12)
        .offset(Number(Input.offset) ?? 0)

      return data
    } catch (error) {
      Logger.error(error)
      throw new GraphQLError('Internal Server Error', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' }
      });
    }
  }

  async findAllFollower(loggedUser: User, Input: SearchByUsernameInput): Promise<AuthorData[] | GraphQLError> {
     try {
      const data = await this.drizzleProvider.db.select({
        id: UserSchema.id,
        username: UserSchema.username,
        email: UserSchema.email,
        profilePicture: UserSchema.profilePicture,
        name: UserSchema.name,
        following: exists(this.drizzleProvider.db.select()
          .from(FriendshipSchema).where(and(
            eq(FriendshipSchema.authorUsername, loggedUser.username),
            eq(FriendshipSchema.followingUsername, UserSchema.username),
          ))),
        followed_by: exists(this.drizzleProvider.db.select()
          .from(FriendshipSchema).where(and(
            eq(FriendshipSchema.authorUsername, UserSchema.username),
            eq(FriendshipSchema.followingUsername, loggedUser.username),
          ))),
      })
        .from(FriendshipSchema)
        .where(eq(FriendshipSchema.followingUsername, Input.username))
        .leftJoin(UserSchema, eq(FriendshipSchema.authorUsername, UserSchema.username))
        .orderBy(desc(FriendshipSchema.createdAt))
        .limit(Number(Input.limit) ?? 12)
        .offset(Number(Input.offset) ?? 0)

      return data
    } catch (error) {
      Logger.error(error)
      throw new GraphQLError('Internal Server Error', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' }
      });
    }
  }
}