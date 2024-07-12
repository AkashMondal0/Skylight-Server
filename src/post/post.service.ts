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
import { CreatePostInput } from './dto/create-post.input';
import { SearchByUsernameInput } from 'src/friendship/dto/get-friendship.input';

@Injectable()
export class PostService {
  constructor(private readonly drizzleProvider: DrizzleProvider) { }
 
  async findAllByProfileName(loggedUser: User, findPosts: SearchByUsernameInput): Promise<PostType[] | GraphQLError> {
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
        },
      }).from(PostSchema)
        .where(eq(PostSchema.username, findPosts.Username))
        .limit(Number(findPosts.limit) ?? 12)
        .offset(Number(findPosts.offset) ?? 0)
        .leftJoin(CommentSchema, eq(PostSchema.id, CommentSchema.postId))
        .leftJoin(LikeSchema, eq(PostSchema.id, LikeSchema.postId))
        .leftJoin(UserSchema, eq(PostSchema.authorId, UserSchema.id))
        .groupBy(PostSchema.id, UserSchema.id)

      return data
    } catch (error) {
      Logger.error(error)
      throw new GraphQLError(error)
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

  async createPost(loggedUser: User, body: CreatePostInput): Promise<PostType | GraphQLError> {
    try {
      if (loggedUser.id !== body.authorId) {
        throw new GraphQLError('You are not authorized to perform this action')
      }
      const data = await this.drizzleProvider.db.insert(PostSchema).values({
        content: body.content,
        fileUrl: body.fileUrl,
        authorId: body.authorId,
        status: body.status,
        username: loggedUser.username
      }).returning()

      return data[0]
    } catch (error) {
      Logger.error(error)
      throw new GraphQLError(error)
    }
  }

}
