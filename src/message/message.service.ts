import { Injectable } from '@nestjs/common';
import { CreateMessageInput } from './dto/create-message.input';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
import { Message } from './entities/message.entity';
import { ConversationSchema, MessagesSchema, UserSchema } from 'src/db/drizzle/drizzle.schema';
import { eq, asc, desc, and, sql, arrayContains, not } from 'drizzle-orm';
import { Author } from 'src/users/entities/author.entity';
import { GraphQLPageQuery } from 'src/lib/types/graphql.global.entity';

interface SeenUserIds {
  conversationId: string
}
@Injectable()
export class MessageService {
  constructor(
    private readonly drizzleProvider: DrizzleProvider
  ) { }
  async findAll(user: Author, graphQLPageQuery: GraphQLPageQuery): Promise<Message[]> {
    const data = this.drizzleProvider.db.select({
      id: MessagesSchema.id,
      conversationId: MessagesSchema.conversationId,
      authorId: MessagesSchema.authorId,
      content: MessagesSchema.content,
      fileUrl: MessagesSchema.fileUrl,
      deleted: MessagesSchema.deleted,
      seenBy: MessagesSchema.seenBy,
      createdAt: MessagesSchema.createdAt,
      updatedAt: MessagesSchema.updatedAt,
      user: {
        id: UserSchema.id,
        username: UserSchema.username,
        email: UserSchema.email,
        profilePicture: UserSchema.profilePicture,
        name: UserSchema.name,
      }
    })
      .from(MessagesSchema)
      .where(and(
        eq(MessagesSchema.conversationId, graphQLPageQuery.id),
        arrayContains(ConversationSchema.members, [user.id])
      ))
      .leftJoin(ConversationSchema, eq(MessagesSchema.conversationId, ConversationSchema.id))
      .leftJoin(UserSchema, eq(MessagesSchema.authorId, UserSchema.id))
      .orderBy(desc(MessagesSchema.createdAt))
      .limit(graphQLPageQuery.limit ?? 16)
      .offset(graphQLPageQuery.offset ?? 0)

    return (await data)?.reverse()
  }

  async create(user: Author, createMessageInput: CreateMessageInput): Promise<Message> {
    const data = await this.drizzleProvider.db.insert(MessagesSchema)
      .values({
        content: createMessageInput.content,
        conversationId: createMessageInput.conversationId,
        authorId: createMessageInput.authorId,
        fileUrl: createMessageInput.fileUrl,
        seenBy: [user.id]
      })
      .returning()

    return data[0]
  }

  async seenMessages(user: Author, conversationId: string): Promise<boolean> {
    await this.drizzleProvider.db.update(MessagesSchema)
      .set({
        seenBy: sql`array_append(${MessagesSchema.seenBy}, ${user.id})`
      })
      .where(and(
        eq(MessagesSchema.conversationId, conversationId),
        not(arrayContains(MessagesSchema.seenBy, [user.id]))
      ))

    return true
  }

}
