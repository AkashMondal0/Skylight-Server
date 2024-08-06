import { Injectable } from '@nestjs/common';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
import { Message } from './entities/message.entity';
import { MessagesSchema, UserSchema } from 'src/db/drizzle/drizzle.schema';
import { eq, desc } from 'drizzle-orm';
import { Author } from 'src/users/entities/author.entity';
import { GraphQLPageQuery } from 'src/lib/types/graphql.global.entity';

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
      .where(eq(MessagesSchema.conversationId, graphQLPageQuery.id))
      .leftJoin(UserSchema, eq(MessagesSchema.authorId, UserSchema.id))
      .orderBy(desc(MessagesSchema.createdAt))
      .limit(graphQLPageQuery.limit ?? 12)
      .offset(graphQLPageQuery.offset ?? 0)
    return data
  }

  async create(user: Author, createMessageInput: CreateMessageInput): Promise<Message> {
    const data = await this.drizzleProvider.db.insert(MessagesSchema)
      .values({
        content: createMessageInput.content,
        conversationId: createMessageInput.conversationId,
        authorId: createMessageInput.authorId,
        fileUrl: createMessageInput.fileUrl
      })
      .returning()

    return data[0]
  }
}
