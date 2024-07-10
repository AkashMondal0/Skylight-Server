import { FastifyReply } from 'fastify';
import { ForbiddenException, HttpException, Injectable, Logger } from '@nestjs/common';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
// import { comments, friendship, likes, posts, users } from 'src/db/drizzle/drizzle.schema';
import { count, eq, desc, exists, and, countDistinct } from "drizzle-orm";
import { PostResponse } from 'src/types/response.type';
import { CreatePostPayload, UpdatePostPayload } from 'src/validation/ZodSchema';
import { PostType, User } from 'src/types';
import { GraphQLError } from 'graphql';
import { CommentSchema, FriendshipSchema, LikeSchema, PostSchema, UserSchema } from 'src/db/drizzle/drizzle.schema';

@Injectable()
export class PostService {
  constructor(private readonly drizzleProvider: DrizzleProvider) { }
  findAll() { }
  findOne() { }
  update() { }
  remove() { }
  postTimelineConnection() { }

  async createPost(body: CreatePostPayload): Promise<PostType | HttpException> {
    try {
      const data = await this.drizzleProvider.db.insert(PostSchema).values({
        content: body.content,
        fileUrl: body.fileUrl,
        authorId: body.authorId,
        status: body.status,
        title: body.title ?? "",
      }).returning()

      if (!data[0]) {
        throw new HttpException('Database Internal Server Error ', 500)
      }

      return data[0]
    } catch (error) {
      Logger.error(error)
      throw new HttpException('Internal Server Error', 500)
    }
  }


  async viewOnePost(loggedUser: User, id: string): Promise<PostType | GraphQLError> {
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
      }).from(PostSchema)
        .where(eq(PostSchema.id, id)).limit(1)
        .leftJoin(CommentSchema, eq(PostSchema.id, CommentSchema.postId))
        .leftJoin(LikeSchema, eq(PostSchema.id, LikeSchema.postId))
        .leftJoin(UserSchema, eq(PostSchema.authorId, UserSchema.id))
        .groupBy(PostSchema.id, UserSchema.id)

      return data[0]
    } catch (error) {
      Logger.error(error)
      throw new GraphQLError(error)
    }
  }

}
