import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
import { CreateFriendshipInput } from './dto/create-friendship.input';
import { GraphQLError } from 'graphql';
import { DestroyFriendship } from './dto/delete-friendship.input';
import { and, eq, desc, count, countDistinct, exists, sql } from 'drizzle-orm';
import { CommentSchema, FriendshipSchema, LikeSchema, PostSchema, UserSchema } from 'src/db/drizzle/drizzle.schema';
import { GraphQLPageQuery } from 'src/lib/types/graphql.global.entity';
import { Author } from 'src/users/entities/author.entity';
import { Post } from 'src/post/entities/post.entity';

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

  async feedTimelineConnection(loggedUser: Author): Promise<Post[]> {
    try {

      const data = await this.drizzleProvider.db.select({
        id: PostSchema.id,
        content: PostSchema.content,
        fileUrl: PostSchema.fileUrl,
        createdAt: PostSchema.createdAt,
        updatedAt: PostSchema.updatedAt,
        likeCount: sql`COUNT(DISTINCT ${LikeSchema.id}) AS likeCount`,
        commentCount: sql`COUNT(DISTINCT ${CommentSchema.id}) AS commentCount`,
        is_Liked: exists(this.drizzleProvider.db.select().from(LikeSchema).where(and(
          eq(LikeSchema.authorId, loggedUser.id), // <-  logged user id
          eq(LikeSchema.postId, PostSchema.id)
        ))),
        user: {
          id: UserSchema.id,
          username: UserSchema.username,
          email: UserSchema.email,
          profilePicture: UserSchema.profilePicture,
          name: UserSchema.name,
          followed_by: exists(this.drizzleProvider.db.select().from(FriendshipSchema).where(and(
            eq(FriendshipSchema.followingUserId, loggedUser.id),// <-  logged user id
            eq(FriendshipSchema.authorUserId, UserSchema.id)
          ))),
          following: exists(this.drizzleProvider.db.select().from(FriendshipSchema).where(and(
            eq(FriendshipSchema.followingUserId, UserSchema.id),
            eq(FriendshipSchema.authorUserId, loggedUser.id)
          ))),
        },
      })
        .from(PostSchema)
        .leftJoin(LikeSchema, eq(PostSchema.id, LikeSchema.postId))
        .leftJoin(CommentSchema, eq(PostSchema.id, CommentSchema.postId))
        .where(eq(FriendshipSchema.followingUserId, PostSchema.authorId))
        .innerJoin(FriendshipSchema, eq(FriendshipSchema.authorUserId, loggedUser.id))
        .leftJoin(UserSchema, eq(PostSchema.authorId, UserSchema.id))
        .limit(12)
        .offset(0)
        .orderBy(desc(PostSchema.createdAt))
        .groupBy(
          PostSchema.id,
          UserSchema.id,
        )
      return data as Post[]
    } catch (error) {
      Logger.error(error)
      throw new GraphQLError('Internal Server Error', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' }
      });
    }
  }

  async findAllFollowing(loggedUser: Author, Input: GraphQLPageQuery): Promise<Author[] | GraphQLError> {
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
        .where(eq(FriendshipSchema.authorUsername, Input.id),)
        .leftJoin(UserSchema, eq(FriendshipSchema.followingUsername, UserSchema.username))
        .orderBy(desc(FriendshipSchema.createdAt))
        .limit(Number(Input.limit) ?? 12)
        .offset(Number(Input.offset) ?? 0)

      return data as Author[]
    } catch (error) {
      Logger.error(error)
      throw new GraphQLError('Internal Server Error', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' }
      });
    }
  }

  async findAllFollower(loggedUser: Author, Input: GraphQLPageQuery): Promise<Author[] | GraphQLError> {
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
        .where(eq(FriendshipSchema.followingUsername, Input.id))
        .leftJoin(UserSchema, eq(FriendshipSchema.authorUsername, UserSchema.username))
        .orderBy(desc(FriendshipSchema.createdAt))
        .limit(Number(Input.limit) ?? 12)
        .offset(Number(Input.offset) ?? 0)

      return data as Author[]
    } catch (error) {
      Logger.error(error)
      throw new GraphQLError('Internal Server Error', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' }
      });
    }
  }
}