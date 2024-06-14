import { HttpException, Injectable, Logger } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
import { comments, followers, likes, posts, users } from 'src/db/drizzle/drizzle.schema';
import { count, eq, desc, exists, and, countDistinct } from "drizzle-orm";
import { PostTimeline } from 'src/types/response.type';
import { CreatePostPayload } from 'src/validation/ZodSchema';
import { User } from 'src/types';

@Injectable()
export class PostService {
  constructor(
    private readonly drizzleProvider: DrizzleProvider
  ) { }

  async create(body: CreatePostPayload): Promise<string> {
    try {
      // await this.drizzleProvider.db.insert(posts).values({
      //   caption: body.caption,
      //   fileUrl: body.fileUrl,
      //   authorId: body.authorId,
      // })
      return 'Post created successfully'
    } catch (error) {
      Logger.error(error)
      throw new HttpException('Internal Server Error', 500)
    }
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostInput: UpdatePostInput) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }

  // async postTimelineConnection(userId: string, limit: number, offset: number): Promise<PostTimeline[] | []> {
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
  //       },
  //     })
  //       .from(followers)
  //       .where(eq(followers.followerUserId, userId)) // <-- This is the user ID
  //       .limit(12)
  //       .offset(0)
  //       .orderBy(desc(posts.createdAt))
  //       .leftJoin(posts, eq(followers.followingUserId, posts.authorId))
  //       .leftJoin(comments, eq(posts.id, comments.postId))
  //       .leftJoin(likes, eq(posts.id, likes.postId))
  //       .leftJoin(users, eq(posts.authorId, users.id))
  //       .groupBy(posts.id, users.id)

  //     return data
  //   } catch (error) {
  //     console.log(error)
  //     return []
  //   }
  // }
}
