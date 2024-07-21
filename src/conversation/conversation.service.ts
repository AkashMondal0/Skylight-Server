import { Injectable } from '@nestjs/common';
import { CreateConversationInput } from './dto/create-conversation.input';
import { UpdateConversationInput } from './dto/update-conversation.input';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
import { RedisProvider } from 'src/db/redisio/redis.provider';
import { and, arrayContains, desc, eq, inArray, ne, sql } from 'drizzle-orm';
import { GraphQLError } from 'graphql';
import { ConversationSchema, UserSchema } from 'src/db/drizzle/drizzle.schema';
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

    const {
      authorId,
      memberIds,
      isGroup = false,
      groupDescription = "Group",
      groupName = "Group",
      groupImage = "/user.jpg"
    } = createConversationInput

    // create group
    if (isGroup && memberIds.length >= 2) {
      const data = await this.drizzleProvider.db.insert(ConversationSchema).values({
        authorId: authorId ?? user.id,
        members: memberIds,
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

      return data[0]
    }

    if (memberIds.length < 1) {
      throw new GraphQLError("Invalid members create dm with only 2 members")
    }

    // find private
    const findConversationData = await this.drizzleProvider.db.select({
      id: ConversationSchema.id,
    })
      .from(ConversationSchema)
      .where(
        and(
          arrayContains(ConversationSchema.members, memberIds),
          eq(ConversationSchema.isGroup, false)
        )
      )
      .limit(1)

    if (findConversationData.length > 0) {
      throw new GraphQLError("Conversation already exist")
    }

    // create private
    const data = await this.drizzleProvider.db.insert(ConversationSchema).values({
      authorId: authorId ?? user.id,
      members: memberIds,
      userId: memberIds.filter((id) => id !== authorId)[0],
      isGroup,
    }).returning()

    return data[0]
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
      .leftJoin(UserSchema, and(
        eq(UserSchema.id, ConversationSchema.userId),
        eq(ConversationSchema.isGroup, false),
      ))
      .orderBy(desc(ConversationSchema.updatedAt))
      .limit(graphQLPageQuery.limit ?? 12)
      .offset(graphQLPageQuery.offset ?? 0)

    return data
  }

  findOne(id: number) {

    // const findUserData = async (id: string) => {
    //   const _data = await this.drizzleProvider.db.select({
    //     id: UserSchema.id,
    //     email: UserSchema.email,
    //     username: UserSchema.username,
    //     profilePicture: UserSchema.profilePicture,
    //     name: UserSchema.name
    //   })
    //     .from(UserSchema)
    //     .where(eq(UserSchema.id, id))
    //   return _data[0] ?? null
    // }

    // const _data = await Promise.all(
    //   data.map(async (item) => {
    //     return {
    //       ...item,
    //       messages: [],
    //       members:[],
    //     }
    //   })
    // )

    // console.log(_data)
    // const finalData = await Promise.all(
    //   data.map(async (item) => {
    //     return {
    //       ...item,
    //       members: !item.isGroup ? await findUserData(item.members as string[]) : [],
    //       messages: []
    //     }
    //   })
    // )
    return `This action returns a #${id} conversation`;
  }

  update(id: number, updateConversationInput: UpdateConversationInput) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
