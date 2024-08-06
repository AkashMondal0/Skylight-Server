import { Injectable } from '@nestjs/common';
import { CreateConversationInput } from './dto/create-conversation.input';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
import { RedisProvider } from 'src/db/redis/redis.provider';
import { and, arrayContains, asc, desc, eq, or, sql } from 'drizzle-orm';
import { GraphQLError } from 'graphql';
import { ConversationSchema, MessagesSchema, UserSchema } from 'src/db/drizzle/drizzle.schema';
import { Conversation } from './entities/conversation.entity';
import { Author } from 'src/users/entities/author.entity';
import { GraphQLPageQuery } from 'src/lib/types/graphql.global.entity';
@Injectable()
export class ConversationService {
  constructor(
    private readonly drizzleProvider: DrizzleProvider,
    private readonly redisProvider: RedisProvider
  ) { }

  async create(user: Author, createConversationInput: CreateConversationInput): Promise<Conversation | GraphQLError> {

    const { memberIds, isGroup = false, groupDescription = "Group", groupName = "Group", groupImage = "/user.jpg" } = createConversationInput

    // create group
    if (isGroup && memberIds.length >= 2) {
      const data = await this.drizzleProvider.db.insert(ConversationSchema).values({
        authorId: user.id,
        members: [user.id, ...memberIds],
        isGroup,
        groupDescription,
        groupImage,
        groupName
      }).returning()

      if (!data[0]) {
        throw new GraphQLError("Invalid members create dm with only 2 members", {
          extensions: {}
        })
      }

      return data[0] as Conversation
    }

    if (memberIds.length < 1) {
      throw new GraphQLError("Invalid members create dm with only 2 members")
    }

    // find private
    const findConversationData = await this.drizzleProvider.db.select({ id: ConversationSchema.id })
      .from(ConversationSchema)
      .where(and(arrayContains(ConversationSchema.members, memberIds), eq(ConversationSchema.isGroup, false)))
      .limit(1)

    if (findConversationData[0]) {
      return findConversationData[0] as Conversation
    }
    // create private
    const data = await this.drizzleProvider.db.insert(ConversationSchema).values({
      authorId: user.id,
      members: [user.id, ...memberIds],
      userId: memberIds[0],
      isGroup,
    })
      .returning({ id: ConversationSchema.id })

    return data[0] as Conversation
  }

  async findAll(user: Author, graphQLPageQuery: GraphQLPageQuery): Promise<Conversation[] | GraphQLError> {

    const data = await this.drizzleProvider.db.select({
      id: ConversationSchema.id,
      authorId: ConversationSchema.authorId,
      members: ConversationSchema.members,
      isGroup: ConversationSchema.isGroup,
      groupDescription: ConversationSchema.groupDescription,
      groupImage: ConversationSchema.groupImage,
      groupName: ConversationSchema.groupName,
      updatedAt: ConversationSchema.updatedAt,
      lastMessageContent: ConversationSchema.lastMessageContent,
      messages: ConversationSchema.messages,
      user: {
        id: UserSchema.id,
        username: UserSchema.username,
        email: UserSchema.email,
        profilePicture: UserSchema.profilePicture,
        name: UserSchema.name,
      }
    })
      .from(ConversationSchema)
      .where(arrayContains(ConversationSchema.members, [user.id]))
      .leftJoin(UserSchema, eq(UserSchema.id,
        sql`CASE 
          WHEN ${ConversationSchema.userId} = ${user.id} THEN ${ConversationSchema.authorId}
          WHEN ${ConversationSchema.authorId} = ${user.id} THEN ${ConversationSchema.userId}
          ELSE ${ConversationSchema.userId}
        END`
      ))
      .orderBy(desc(ConversationSchema.updatedAt))
      .limit(graphQLPageQuery.limit ?? 12)
      .offset(graphQLPageQuery.offset ?? 0);

    return data.map((item) => {
      return {
        ...item,
        messages: []
      }
    })
  }

  async findOne(user: Author, graphQLPageQuery: GraphQLPageQuery): Promise<Conversation | GraphQLError> {

    const data = await this.drizzleProvider.db.select({
      id: ConversationSchema.id,
      authorId: ConversationSchema.authorId,
      members: ConversationSchema.members,
      isGroup: ConversationSchema.isGroup,
      groupDescription: ConversationSchema.groupDescription,
      groupImage: ConversationSchema.groupImage,
      groupName: ConversationSchema.groupName,
      updatedAt: ConversationSchema.updatedAt,
      lastMessageContent: ConversationSchema.lastMessageContent,
      messages: ConversationSchema.messages,
      user: {
        id: UserSchema.id,
        username: UserSchema.username,
        email: UserSchema.email,
        profilePicture: UserSchema.profilePicture,
        name: UserSchema.name,
      }
    })
      .from(ConversationSchema)
      .where(eq(ConversationSchema.id, graphQLPageQuery.id))
      .leftJoin(UserSchema, eq(UserSchema.id,
        sql`CASE 
          WHEN ${ConversationSchema.userId} = ${user.id} THEN ${ConversationSchema.authorId}
          WHEN ${ConversationSchema.authorId} = ${user.id} THEN ${ConversationSchema.userId}
          ELSE ${ConversationSchema.userId}
        END`
      ))
      .limit(1)

      if (!data[0]) {
        throw new GraphQLError("Conversation not found")
      }

    return data[0]
  }
}
