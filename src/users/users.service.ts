import { Injectable, Logger } from '@nestjs/common';
import { count, countDistinct, eq, exists, like, or, and, inArray } from 'drizzle-orm';
import { GraphQLError } from 'graphql';
import { createHash } from 'src/auth/bcrypt/bcrypt.function';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
import { FriendshipSchema, PostSchema, UserSchema } from 'src/db/drizzle/drizzle.schema';
import { User } from 'src/types';
import { ProfileView } from 'src/types/response.type';
import { RegisterUserPayload } from 'src/validation/ZodSchema';

@Injectable()
export class UsersService {
  constructor(
    private readonly drizzleProvider: DrizzleProvider
  ) { }

  async createUser(userCredential: RegisterUserPayload): Promise<User | null> {
    const hashPassword = await createHash(userCredential.password)

    try {
      const newUser = await this.drizzleProvider.db.insert(UserSchema).values({
        username: userCredential.username,
        password: hashPassword,
        name: userCredential.name,
        email: userCredential.email,
      }).returning()

      if (!newUser[0]) {
        return null;
      }

      return newUser[0];
    } catch (error) {
      Logger.error(error)
      return null
    }
  }

  async findOneUserById(id: string): Promise<User | null> {
    try {
      const user = await this.drizzleProvider.db.select({
        id: UserSchema.id,
        username: UserSchema.username,
        name: UserSchema.name,
        email: UserSchema.email,
        profilePicture: UserSchema.profilePicture,
        password: UserSchema.password,
        bio: UserSchema.bio,
        createdAt: UserSchema.createdAt,
        accessToken: UserSchema.accessToken,
        roles: UserSchema.roles
      }).from(UserSchema)
        .where(eq(UserSchema.id, id))
        .limit(1)

      if (!user[0]) {
        return null
      }

      return user[0];
    } catch (error) {
      Logger.error(error)
      return null
    }
  }

  async findOneByUsername(email: string): Promise<User | null> {
    try {
      const user = await this.drizzleProvider.db.select({
        id: UserSchema.id,
        username: UserSchema.username,
        name: UserSchema.name,
        email: UserSchema.email,
        profilePicture: UserSchema.profilePicture,
        password: UserSchema.password,
        bio: UserSchema.bio,
        createdAt: UserSchema.createdAt,
        accessToken: UserSchema.accessToken,
        roles: UserSchema.roles
      })
        .from(UserSchema)
        .where(
          or(
            eq(UserSchema.email, email),
            eq(UserSchema.username, email)
          )
        )
        .limit(1)

      if (!user[0]) {
        return null;
      }
      return user[0];
    } catch (error) {
      Logger.error(error)
      return null;
    }
  }

  async findOneByUsernameAndEmail(email: string, username: string): Promise<User | null> {
    try {
      const user = await this.drizzleProvider.db.select({
        id: UserSchema.id,
        username: UserSchema.username,
        name: UserSchema.name,
        email: UserSchema.email,
        profilePicture: UserSchema.profilePicture,
        password: UserSchema.password,
        bio: UserSchema.bio,
        createdAt: UserSchema.createdAt,
        accessToken: UserSchema.accessToken,
        roles: UserSchema.roles
      })
        .from(UserSchema)
        .where(or(
          eq(UserSchema.email, email),
          eq(UserSchema.username, username)
        ))
        .limit(1)

      if (!user[0]) {
        return null;
      }
      return user[0];
    } catch (error) {
      Logger.error(error)
      return null;
    }
  }

  async findManyByUsernameAndEmail(keywords: string): Promise<User[] | []> {
    try {
      const data = await this.drizzleProvider.db.select({
        id: UserSchema.id,
        username: UserSchema.username,
        email: UserSchema.email,
        name: UserSchema.name,
        profilePicture: UserSchema.profilePicture,
        bio: UserSchema.bio,
        isVerified: UserSchema.isVerified,
        isPrivate: UserSchema.isPrivate,
      }).from(UserSchema).where(
        or(
          like(UserSchema.username, `%${keywords}%`),
          like(UserSchema.name, `%${keywords}%`)
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

  async findProfile(user: User, username: string): Promise<ProfileView | GraphQLError> {
    try {
      const data = await this.drizzleProvider.db.select({
        id: UserSchema.id,
        username: UserSchema.username,
        email: UserSchema.email,
        name: UserSchema.name,
        profilePicture: UserSchema.profilePicture,
        bio: UserSchema.bio,
        isVerified: UserSchema.isVerified,
        isPrivate: UserSchema.isPrivate,
        postCount: count(eq(PostSchema.authorId, UserSchema.id)),
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
          // Add more fields here
        }
      }).from(UserSchema)
        .where(eq(UserSchema.username, username)) // <- Update the condition here
        .leftJoin(PostSchema, eq(PostSchema.id, UserSchema.id)) // Update the join condition here
        .leftJoin(FriendshipSchema, eq(FriendshipSchema.authorUserId, UserSchema.id)) // Update the join condition here
        .limit(1)
        .groupBy(UserSchema.id)

      if (data.length <= 0 || !data[0].id) {
        throw new GraphQLError("An error occurred while fetching user profile")
      }

      const followerCount = await this.drizzleProvider.db.select({
        count: countDistinct(FriendshipSchema.authorUserId)
      }).from(FriendshipSchema).where(eq(FriendshipSchema.followingUserId, data[0].id))
      const followingCount = await this.drizzleProvider.db.select({
        count: countDistinct(FriendshipSchema.followingUserId)
      }).from(FriendshipSchema).where(eq(FriendshipSchema.authorUserId, data[0].id))

      const followingList = [
        "259f9837-1514-4183-9157-bc1f1f504f0e",
        "72932765-a392-42eb-b936-d7a8ceb1a541",
        "e4a31dd8-13f9-4c8e-9e55-01baa79c3b5e"
      ] // <- Update the following list here

      const top_followers = await this.drizzleProvider.db.select({
        id: UserSchema.id,
        username: UserSchema.username,
        email: UserSchema.email,
        profilePicture: UserSchema.profilePicture,
      })
        .from(FriendshipSchema)
        .leftJoin(UserSchema, eq(UserSchema.id, FriendshipSchema.authorUserId))
        .where(inArray(FriendshipSchema.authorUserId, followingList))

      return {
        ...data[0],
        followerCount: followerCount[0].count,
        followingCount: followingCount[0].count,
        top_followers: top_followers,
      }
    } catch (error) {
      Logger.error(error)
      throw new GraphQLError("An error occurred while fetching user profile")
    }
  }

}