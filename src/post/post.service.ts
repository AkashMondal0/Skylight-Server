import { FastifyReply } from 'fastify';
import { ForbiddenException, HttpException, Injectable, Logger } from '@nestjs/common';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
// import { comments, friendship, likes, posts, users } from 'src/db/drizzle/drizzle.schema';
import { count, eq, desc, exists, and, countDistinct } from "drizzle-orm";
import { PostResponse } from 'src/types/response.type';
import { CreatePostPayload, UpdatePostPayload } from 'src/validation/ZodSchema';
import { PostType, User } from 'src/types';
import { GraphQLError } from 'graphql';

@Injectable()
export class PostService {
  constructor(private readonly drizzleProvider: DrizzleProvider) { }
  create (){}
  findAll (){}
  findOne (){}
  update (){}
  remove (){}
  postTimelineConnection (){}
  
  // async create(body: CreatePostPayload): Promise<PostType | HttpException> {
  //   try {
  //     const data = await this.drizzleProvider.db.insert(posts).values({
  //       caption: body.caption,
  //       fileUrl: body.fileUrl,
  //       authorId: body.authorId,
  //     }).returning()

  //     if (!data[0]) {
  //       throw new HttpException('Database Internal Server Error ', 500)
  //     }

  //     return data[0]
  //   } catch (error) {
  //     Logger.error(error)
  //     throw new HttpException('Internal Server Error', 500)
  //   }
  // }

  // async findAll(): Promise<PostType[] | GraphQLError> {
  //   // try {
  //   //   const data = await this.drizzleProvider.db.select().from(posts)
  //   //   return data
  //   // } catch (error) {
  //   //   Logger.error(error)
  //   //   if (error instanceof GraphQLError) {
  //   //     throw error;
  //   //   } else {
  //   //     throw new GraphQLError('Internal Server Error', {
  //   //       extensions: { code: 'INTERNAL_SERVER_ERROR' }
  //   //     });
  //   //   }
  //   // }
  // }

  // async findOne(id: string): Promise<PostType | GraphQLError> {
  //   try {
  //     const data = await this.drizzleProvider.db.select().from(posts)
  //       .where(eq(posts.id, id)).limit(1)
  //     return data[0]
  //   } catch (error) {
  //     Logger.error(error)
  //     throw new GraphQLError(error)
  //   }
  // }

  // async update(body: UpdatePostPayload): Promise<PostType | HttpException> {
  //   try {
  //     const data = await this.drizzleProvider.db.update(posts).set({
  //       caption: body.caption,
  //       fileUrl: body.fileUrl,
  //     }).where(eq(posts.id, body.id)).returning()

  //     if (!data[0]) {
  //       throw new HttpException('Database Internal Server Error ', 500)
  //     }

  //     return data[0]
  //   } catch (error) {
  //     Logger.error(error)
  //     throw new HttpException('Internal Server Error', 500)
  //   }
  // }

  // async remove(id: string): Promise<boolean | HttpException> {
  //   try {
  //     await this.drizzleProvider.db.delete(posts).where(eq(posts.id, id));
  //     return false
  //   } catch (error) {
  //     Logger.error(error)
  //     return true
  //   }
  // }

  // async postTimelineConnection(userId: string, limit: number, offset: number): Promise<PostResponse[] | []> {
  //   try {
  //     const data = await this.drizzleProvider.db.select({
  //       id: posts.id,
  //       caption: posts.caption,
  //       fileUrl: posts.fileUrl,
  //       commentCount: count(eq(comments.postId, posts.id)),
  //       likeCount: countDistinct(eq(likes.postId, posts.id)),
  //       createdAt: posts.createdAt,
  //       alreadyLiked: exists(this.drizzleProvider.db.select().from(likes).where(and(
  //         eq(likes.authorId, userId), // <-- This is the user ID
  //         eq(likes.postId, posts.id)
  //       ))),
  //       user: {
  //         id: users.id,
  //         username: users.username,
  //         email: users.email,
  //         profilePicture: users.profilePicture,
  //         name: users.name,
  //       },
  //     })
  //       .from(friendship)
  //       .where(eq(friendship.followerUserId, userId)) // <-- This is the user ID
  //       .limit(limit)
  //       .offset(offset)
  //       .orderBy(desc(posts.createdAt))
  //       .leftJoin(posts, eq(friendship.followingUserId, posts.authorId))
  //       .leftJoin(comments, eq(posts.id, comments.postId))
  //       .leftJoin(likes, eq(posts.id, likes.postId))
  //       .leftJoin(users, eq(posts.authorId, users.id))
  //       .groupBy(posts.id, users.id)

  //     if (data.length <= 0) {
  //       return []
  //     }

  //     return data.map((post) => {
  //       return {
  //         ...post,
  //         comments: [],
  //         likes: [],
  //       }
  //     })
  //   } catch (error) {
  //     console.log(error)
  //     return []
  //   }
  // }
}
