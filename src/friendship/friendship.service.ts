import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
import { CreateFriendshipInput } from './dto/create-friendship.input';
import { GraphQLError } from 'graphql';
import { DestroyFriendship } from './dto/delete-friendship.input';
import { and, eq } from 'drizzle-orm';
import { Friendship } from 'src/types';
import { FriendshipSchema } from 'src/db/drizzle/drizzle.schema';

@Injectable()
export class FriendshipService {
  constructor(private readonly drizzleProvider: DrizzleProvider) { }


  async create(createFollowInput: CreateFriendshipInput): Promise<Friendship> {
    try {
      const check = await this.drizzleProvider.db.select().from(FriendshipSchema).where(and(
        eq(FriendshipSchema.followingUsername, createFollowInput.followingUsername),
        eq(FriendshipSchema.authorUsername, createFollowInput.authorUsername),
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
      const data = await this.drizzleProvider.db.insert(FriendshipSchema).values({
        followingUsername: createFollowInput.followingUsername,
        authorUsername: createFollowInput.authorUsername
      }).returning()

      return data[0];

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

  async feedTimelineConnection(id: string) {
    try {
      // const data = await this.drizzleProvider.db.select({
      //   id: posts.id,
      //   caption: posts.caption,
      //   fileUrl: posts.fileUrl,
      //   commentCount: count(eq(comments.postId, posts.id)),
      //   likeCount: countDistinct(eq(likes.postId, posts.id)),
      //   createdAt: posts.createdAt,
      //   alreadyLiked: exists(db.select().from(likes).where(and(
      //     eq(likes.authorId, verify_id),
      //     eq(likes.postId, posts.id)
      //   ))),
      //   authorData: {
      //     id: users.id,
      //     username: users.username,
      //     email: users.email,
      //     profilePicture: users.profilePicture,
      //   },
      // })
      //   .from(FriendshipSchema)
      //   .where(eq(FriendshipSchema.authorUsername, id))
      //   .limit(12)
      //   .offset(0)
      //   .orderBy(desc(posts.createdAt))
      //   .leftJoin(posts, eq(followers.followingUserId, posts.authorId))
      //   .leftJoin(comments, eq(posts.id, comments.postId))
      //   .leftJoin(likes, eq(posts.id, likes.postId))
      //   .leftJoin(users, eq(posts.authorId, users.id))
      //   .groupBy(
      //     posts.id,
      //     users.id,
      //   )

      // return data;
    } catch (error) {
      Logger.error(error)
      throw new GraphQLError('Error feed Timeline Connection friendship')
    }
  }

  async deleteFriendship(destroyFriendship: DestroyFriendship): Promise<Friendship> {
    try {
      const data = await this.drizzleProvider.db.delete(FriendshipSchema).where(and(
        eq(FriendshipSchema.followingUsername, destroyFriendship.followingUsername),
        eq(FriendshipSchema.authorUsername, destroyFriendship.authorUsername),
      )).returning()

      return data[0];
    } catch (error) {
      Logger.error(error)
      throw new GraphQLError('Error destroy friendship')
    }
  }
}
