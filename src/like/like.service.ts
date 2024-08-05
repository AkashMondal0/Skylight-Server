import { Injectable, Logger } from '@nestjs/common';
import { UpdateLikeInput } from './dto/update-like.input';
import { GraphQLError } from 'graphql';
import { FriendshipSchema, LikeSchema, UserSchema } from 'src/db/drizzle/drizzle.schema';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
import { and, eq, exists } from 'drizzle-orm';
import { GraphQLPageQuery } from 'src/lib/types/graphql.global.entity';
import { Author } from 'src/users/entities/author.entity';

@Injectable()
export class LikeService {
  constructor(private readonly drizzleProvider: DrizzleProvider) { }

  // like find all
  async findAll(sessionUser: Author, searchById: GraphQLPageQuery): Promise<Author[] | GraphQLError> {
    try {
      if (sessionUser) {
        const likes = await this.drizzleProvider.db.select({
          id: UserSchema.id,
          username: UserSchema.username,
          email: UserSchema.email,
          profilePicture: UserSchema.profilePicture,
          name: UserSchema.name,
          following: exists(this.drizzleProvider.db.select()
            .from(FriendshipSchema).where(and(
              eq(FriendshipSchema.authorUsername, sessionUser.username),
              eq(FriendshipSchema.followingUsername, UserSchema.username),
            ))),
          followed_by: exists(this.drizzleProvider.db.select()
            .from(FriendshipSchema).where(and(
              eq(FriendshipSchema.authorUsername, UserSchema.username),
              eq(FriendshipSchema.followingUsername, sessionUser.username),
            ))),
        })
          .from(LikeSchema)
          .where(eq(LikeSchema.postId, searchById.id))
          .leftJoin(UserSchema, eq(LikeSchema.authorId, UserSchema.id))
          .limit(Number(searchById.limit) ?? 12)
          .offset(Number(searchById.offset) ?? 0)

        return likes as Author[]

      } else {
        const likes = await this.drizzleProvider.db.select({
          id: UserSchema.id,
          username: UserSchema.username,
          email: UserSchema.email,
          profilePicture: UserSchema.profilePicture,
          name: UserSchema.name
        })
          .from(LikeSchema)
          .where(eq(LikeSchema.postId, searchById.id))
          .leftJoin(UserSchema, eq(LikeSchema.authorId, UserSchema.id))
          .limit(Number(searchById.limit) ?? 12)
          .offset(Number(searchById.offset) ?? 0)

        return {
          ...likes,
          following: false,
          followed_by: false,
        } as Author[]
      }
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

  // like create
  async create(sessionUser: Author, postId: string): Promise<{ like: boolean } | GraphQLError> {
    try {
      const check = await this.drizzleProvider.db.select({
        id: LikeSchema.id
      }).from(LikeSchema).where(and(
        eq(LikeSchema.authorId, sessionUser.id),
        eq(LikeSchema.postId, postId)
      )).limit(1)

      if (check.length > 0) {
        return {
          like: true,
        }
      }

      await this.drizzleProvider.db.insert(LikeSchema).values({
        authorId: sessionUser.id,
        postId: postId
      })
      return {
        like: true,
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

  // like remove
  async remove(sessionUser: Author, postId: string): Promise<{ like: boolean } | GraphQLError> {
    try {

      await this.drizzleProvider.db.delete(LikeSchema).where(and(
        eq(LikeSchema.authorId, sessionUser.id),
        eq(LikeSchema.postId, postId)
      ))
      return {
        like: false,
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
}
