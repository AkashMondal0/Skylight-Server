import { Injectable, Logger } from '@nestjs/common';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
import { GraphQLError } from 'graphql';
import { FriendshipSchema, HighlightSchema, StorySchema, UserSchema } from 'src/db/drizzle/drizzle.schema';
import { createHighlightInput, CreateStoryInput } from './dto/create-story.input';
import { Author } from 'src/users/entities/author.entity';
import { Story, Highlight } from './entities/story.entity';
import { RedisProvider } from 'src/db/redis/redis.provider';
import { and, asc, between, desc, eq, sql } from 'drizzle-orm';
import { GraphQLPageQuery } from 'src/lib/types/graphql.global.entity';

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
      // filter only 24 hours stories
      const filteredData = data.filter(story => story.expiresAt ? new Date(story.expiresAt).getTime() > new Date().getTime() : false)
      return filteredData
    } catch (error) {
      Logger.error("findStory", error)
      throw new GraphQLError(error)
    }
  }

  async createStory(loggedUser: Author, body: CreateStoryInput): Promise<Story | GraphQLError> {
    try {
      const data = await this.drizzleProvider.db.insert(StorySchema).values({
        content: body.content ?? "",
        fileUrl: body.fileUrl,
        authorId: loggedUser.id,
        status: body.status ?? "published",
        song: body.song ?? [],
        expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // 24 hours
      }).returning()

      if (!data[0]) {
        throw new GraphQLError('Post not created')
      }
      const findUserExistStories = await this.redisProvider.client.get(`user-stories:${loggedUser.id}`)
      if (findUserExistStories) {
        let userExistStories = JSON.parse(findUserExistStories)
        if (Array.isArray(userExistStories)) {
          userExistStories.push(data[0]) // add new story to existing stories
          this.redisProvider.client.set(
            `user-stories:${loggedUser.id}`,
            JSON.stringify(userExistStories),
            'EX', 24 * 60 * 60) // 24 hours
        }
      } else {
        this.redisProvider.client.set(
          `user-stories:${loggedUser.id}`,
          JSON.stringify([data[0]]),
          'EX', 24 * 60 * 60) // 24 hours
        // user data update last status time
      }
      this.drizzleProvider.db.update(UserSchema)
        .set({ lastStatusUpdate: sql`now()` })
        .where(eq(UserSchema.id, loggedUser.id))
        .execute()
      return data[0]
    } catch (error) {
      Logger.error(`Post not created:`, error)
      throw new GraphQLError(error)
    }
  }

  async storyTimelineConnection(loggedUser: Author, limitAndOffset: GraphQLPageQuery): Promise<Author[] | GraphQLError> {
    try {
      const data = await this.drizzleProvider.db.select({
        id: UserSchema.id,
        username: UserSchema.username,
        profilePicture: UserSchema.profilePicture,
        name: UserSchema.name,
      })
        .from(FriendshipSchema)
        .where(eq(FriendshipSchema.authorUserId, loggedUser.id))
        .innerJoin(UserSchema, and(
          eq(FriendshipSchema.followingUserId, UserSchema.id),
          between(UserSchema.lastStatusUpdate, sql`now() - interval '1 day'`, sql`now()`)
        ))
        .groupBy(UserSchema.id)
        .orderBy(desc(UserSchema.lastStatusUpdate))
        .limit(Number(limitAndOffset.limit) ?? 12)
        .offset(Number(limitAndOffset.offset) ?? 0)

      return data as Author[]
    } catch (error) {
      Logger.error("storyTimelineConnection", error)
      throw new GraphQLError('Internal Server Error', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' }
      });
    }
  }

  async findAllPost(loggedUser: Author, limitAndOffset: GraphQLPageQuery): Promise<Story[] | GraphQLError> {
    try {
      const data = await this.drizzleProvider.db.select({
        id: StorySchema.id,
        content: StorySchema.content,
        fileUrl: StorySchema.fileUrl,
        song: StorySchema.song,
        createdAt: StorySchema.createdAt,
        authorId: StorySchema.authorId,
        status: StorySchema.status
      })
        .from(StorySchema)
        .where(eq(StorySchema.authorId, loggedUser.id))
        .orderBy(desc(StorySchema.createdAt))
        .limit(limitAndOffset.limit ?? 12)
        .offset(limitAndOffset.offset ?? 0)

      return data
    } catch (error) {
      Logger.error("findAllPost", error)
      throw new GraphQLError('Internal Server Error', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' }
      });
    }
  }

  async createHighlight(loggedUser: Author, body: createHighlightInput): Promise<Highlight | GraphQLError> {
    try {
      const data = await this.drizzleProvider.db.insert(HighlightSchema).values({
        stories: body.stories,
        authorId: loggedUser.id,
        status: body.status ?? "published",
        content: body.content ?? "",
        coverImageIndex: body.coverImageIndex ?? 0,
      }).returning()

      return data[0]
    } catch (error) {
      Logger.error("createHighlight", error)
      throw new GraphQLError('Internal Server Error', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' }
      });
    }
  }

  async findAllHighlight(loggedUser: Author, limitAndOffset: GraphQLPageQuery): Promise<Highlight[] | GraphQLError> {
    try {
      let data = await this.drizzleProvider.db.select({
        id: HighlightSchema.id,
        content: HighlightSchema.content,
        createdAt: HighlightSchema.createdAt,
        authorId: HighlightSchema.authorId,
        status: HighlightSchema.status,
        stories: HighlightSchema.stories
      })
        .from(HighlightSchema)
        .where(eq(HighlightSchema.authorId, limitAndOffset.id))
        .orderBy(asc(HighlightSchema.createdAt))
        .limit(limitAndOffset.limit ?? 12)
        .offset(limitAndOffset.offset ?? 0)

      return data
    } catch (error) {
      Logger.error("findAllHighlight", error)
      throw new GraphQLError('Internal Server Error', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' }
      });
    }
  }

  async findHighlight(loggedUser: Author, limitAndOffset: GraphQLPageQuery): Promise<Highlight | GraphQLError> {
    try {
      const data = await this.drizzleProvider.db.select({
        id: HighlightSchema.id,
        content: HighlightSchema.content,
        createdAt: HighlightSchema.createdAt,
        authorId: HighlightSchema.authorId,
        status: HighlightSchema.status
      })
        .from(HighlightSchema)
        .where(eq(HighlightSchema.authorId, loggedUser.id))
        .orderBy(desc(HighlightSchema.createdAt))
        .limit(limitAndOffset.limit ?? 12)
        .offset(limitAndOffset.offset ?? 0)

      return data[0]
    } catch (error) {
      Logger.error("findHighlight", error)
      throw new GraphQLError('Internal Server Error', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' }
      });
    }
  }
}