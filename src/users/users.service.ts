import { Injectable, Logger } from '@nestjs/common';
import { count, eq, exists, like, or, and, sql } from 'drizzle-orm';
import { GraphQLError } from 'graphql';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
import { FriendshipSchema, PostSchema, UserSchema } from 'src/db/drizzle/drizzle.schema';
import { Author } from './entities/author.entity';
import { Profile } from './entities/profile.entity';
import { UpdateUsersInput } from './dto/update-users.input';

@Injectable()
export class UsersService {
  constructor(
    private readonly drizzleProvider: DrizzleProvider
  ) { }

  async findUsersByKeyword(keywords: string): Promise<Author[] | []> {
    try {
      const data = await this.drizzleProvider.db.select({
        id: UserSchema.id,
        username: UserSchema.username,
        email: UserSchema.email,
        name: UserSchema.name,
        profilePicture: UserSchema.profilePicture,
        bio: UserSchema.bio,
      }).from(UserSchema).where(
        or(
          like(UserSchema.username, `%${keywords}%`),
          like(UserSchema.name, `%${keywords}%`),
          like(UserSchema.email, `%${keywords}%`),
        )
      ).limit(20)

      if (data.length <= 0 || !data[0].id) {
        return [];
      }

      return data;
    } catch (error) {
      Logger.error(error)
      return [];
    }
  }

  async findProfile(user: Author, username: string): Promise<Profile | GraphQLError> {
    try {
      const data = await this.drizzleProvider.db.select({
        id: UserSchema.id,
        username: UserSchema.username,
        email: UserSchema.email,
        name: UserSchema.name,
        profilePicture: UserSchema.profilePicture,
        bio: UserSchema.bio,
        postCount: sql`COUNT(DISTINCT ${PostSchema.id}) AS postCount`,
        followerCount: sql<number>`COALESCE((
            SELECT COUNT(${FriendshipSchema.followingUserId})
            FROM ${FriendshipSchema}
            WHERE ${FriendshipSchema.followingUserId} = ${UserSchema.id}
          ), 0)`.as('followers_count'),
        followingCount: sql<number>`COALESCE((
            SELECT COUNT(${FriendshipSchema.authorUserId})
            FROM ${FriendshipSchema}
            WHERE ${FriendshipSchema.authorUserId} = ${UserSchema.id}
          ), 0)`.as('following_count'),
        friendship: {
          followed_by: exists(this.drizzleProvider.db.select().from(FriendshipSchema).where(
            and(
              eq(FriendshipSchema.authorUserId, UserSchema.id),
              eq(FriendshipSchema.followingUserId, user.id)
            )
          )),
          following: exists(this.drizzleProvider.db.select().from(FriendshipSchema).where(
            and(
              eq(FriendshipSchema.authorUserId, user.id),
              eq(FriendshipSchema.followingUserId, UserSchema.id)
            )
          ))
        }
      }).from(UserSchema)
        .where(eq(UserSchema.username, username)) // <- Update the condition here
        .leftJoin(PostSchema, eq(UserSchema.id, PostSchema.authorId))
        .fullJoin(FriendshipSchema, or(
          eq(UserSchema.id, FriendshipSchema.authorUserId),
          eq(UserSchema.id, FriendshipSchema.followingUserId)
        ))
        .limit(1)
        .groupBy(UserSchema.id)

      if (!data[0]) {
        throw new GraphQLError("An error occurred while fetching user profile",{
          extensions: { code: 'PAGE_NOT_FOUND' }
        })
      }

      return data[0] as Profile
    } catch (error) {
      Logger.error(error)
      throw new GraphQLError('Internal Server Error', {
        extensions: { code: 'PAGE_NOT_FOUND' }
      });
    }
  }

  async updateProfile(user: Author, updateUsersInput: UpdateUsersInput): Promise<Author | GraphQLError> {
    try {
      const data = await this.drizzleProvider.db.update(UserSchema)
        .set({
          profilePicture: updateUsersInput.profilePicture,
          name: updateUsersInput.name,
          username: updateUsersInput.username,
          email: updateUsersInput.email
        })
        .where(eq(UserSchema.id, user.id))
        .returning({
          profilePicture: UserSchema.profilePicture,
          name: UserSchema.name,
          username: UserSchema.username,
          email: UserSchema.email,
        })

      return data[0] as Author
    } catch (error) {
      Logger.error(error)
      throw new GraphQLError('Internal Server Error', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' }
      });
    }
  }

  // for meta data
  async findUserPublicData(username: string): Promise<Profile | null> {
    try {
      const data = await this.drizzleProvider.db.select({
        username: UserSchema.username,
        name: UserSchema.name,
        profilePicture: UserSchema.profilePicture,
        bio: UserSchema.bio,
        id: UserSchema.id,
        postCount: count(PostSchema.authorId),
      }).from(UserSchema)
        .where(eq(UserSchema.username, username)) // <- Update the condition here
        .leftJoin(PostSchema, eq(PostSchema.authorId, UserSchema.id))
        .limit(1)
        .groupBy(UserSchema.id)


      if (data.length <= 0 || !data[0].username) {
        return null
      }

      const followerCount = await this.drizzleProvider.db.select({
        count: count()
      }).from(FriendshipSchema).where(eq(FriendshipSchema.followingUserId, data[0].id))

      const followingCount = await this.drizzleProvider.db.select({
        count: count()
      }).from(FriendshipSchema).where(eq(FriendshipSchema.authorUserId, data[0].id))

      return {
        ...data[0],
        followerCount: followerCount[0].count,
        followingCount: followingCount[0].count
      }
    } catch (error) {
      return null
    }
  }
}