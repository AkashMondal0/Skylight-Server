
import { Injectable, Logger } from '@nestjs/common';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
// import { eq, asc } from "drizzle-orm";
import { GraphQLError } from 'graphql';
import { StorySchema } from 'src/db/drizzle/drizzle.schema';
import { CreateStoryInput } from './dto/create-story.input';
import { Author } from 'src/users/entities/author.entity';
import { Story } from './entities/story.entity';
import { RedisProvider } from 'src/db/redis/redis.provider';

@Injectable()
export class StoryService {
  constructor(
    private readonly drizzleProvider: DrizzleProvider,
    private readonly redisProvider: RedisProvider,
  ) { }

  async findStory(loggedUser: Author, userId: string): Promise<Story[] | GraphQLError> {
    try {
      const findUserExistStories = await this.redisProvider.client.get(`user-stories:${userId}`)
      if (!findUserExistStories) {
        return []
      }
      const data = JSON.parse(findUserExistStories) as Story[]
      return data
    } catch (error) {
      Logger.error(error)
      throw new GraphQLError(error)
    }
  }

  async createStory(loggedUser: Author, body: CreateStoryInput): Promise<Story | GraphQLError> {
    try {
      if (loggedUser.id !== body.authorId) {
        throw new GraphQLError('You are not authorized to perform this action')
      }
      const data = await this.drizzleProvider.db.insert(StorySchema).values({
        content: body.content ?? "",
        fileUrl: body.fileUrl,
        authorId: loggedUser.id,
        status: body.status ?? "published",
        song: body.song ?? [],
        expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
      }).returning()

      if (!data[0]) {
        throw new GraphQLError('Post not created')
      }
      const findUserExistStories = await this.redisProvider.client.get(`user-stories:${loggedUser.id}`)
      if (findUserExistStories) {
        let userExistStories = JSON.parse(findUserExistStories)
        if (Array.isArray(userExistStories)) {
          userExistStories.push(data[0]) // add new story to existing stories
          this.redisProvider.client.set(`user-stories:${loggedUser.id}`, JSON.stringify(userExistStories), 'EX', 60 * 60 * 24)
        }
      } else {
        this.redisProvider.client.set(`user-stories:${loggedUser.id}`, JSON.stringify([data[0]]), 'EX', 60 * 60 * 24)
      }
      return data[0]
    } catch (error) {
      Logger.error(`Post not created:`, error)
      throw new GraphQLError(error)
    }
  }

}


// async function findStory(loggedUser: Author, userId: string): Promise<Story[] | GraphQLError> {
// const data = await this.drizzleProvider.db.select({
//   id: StorySchema.id,
//   content: StorySchema.content,
//   fileUrl: StorySchema.fileUrl,
//   like: StorySchema.likes,
//   comment: StorySchema.comments,
//   createdAt: StorySchema.createdAt,
//   expiresAt: StorySchema.expiresAt,
//   authorId: StorySchema.authorId,
//   viewCount: StorySchema.viewCount,
//   status: StorySchema.status
// })
//   .from(StorySchema)
//   .where(eq(StorySchema.authorId, userId))
//   .orderBy(asc(StorySchema.createdAt))
// }