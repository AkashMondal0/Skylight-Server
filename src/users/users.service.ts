import { Injectable, Logger } from '@nestjs/common';
import { count, countDistinct, eq, exists, like, or, and, inArray } from 'drizzle-orm';
import { GraphQLError } from 'graphql';
import { createHash } from 'src/auth/bcrypt/bcrypt.function';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
import { FriendshipSchema, PostSchema, UserSchema } from 'src/db/drizzle/drizzle.schema';
import { RegisterUserPayload } from 'src/lib/validation/ZodSchema';
import { Author } from './entities/author.entity';
import { Profile } from './entities/profile.entity';
import { UpdateUsersInput } from './dto/update-users.input';
import { Users } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly drizzleProvider: DrizzleProvider
  ) { }

  async createUser(userCredential: RegisterUserPayload): Promise<Users | null> {
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

  async findOneUserById(id: string): Promise<Users | null> {
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

  async findOneByUsername(email: string): Promise<Users | null> {
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

  async findOneByUsernameAndEmail(email: string, username: string): Promise<Users | null> {
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

  async findManyByUsernameAndEmail(keywords: string): Promise<Users[] | []> {
    try {
      const data = await this.drizzleProvider.db.select({
        id: UserSchema.id,
        username: UserSchema.username,
        email: UserSchema.email,
        name: UserSchema.name,
        profilePicture: UserSchema.profilePicture,
        bio: UserSchema.bio,
        isPrivate: UserSchema.isPrivate,
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
      let data: any;

      if (user) {
        const _data = await this.drizzleProvider.db.select({
          id: UserSchema.id,
          username: UserSchema.username,
          email: UserSchema.email,
          name: UserSchema.name,
          profilePicture: UserSchema.profilePicture,
          bio: UserSchema.bio,
          isVerified: UserSchema.isVerified,
          isPrivate: UserSchema.isPrivate,
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
          .leftJoin(FriendshipSchema, eq(FriendshipSchema.authorUserId, UserSchema.id)) // Update the join condition here
          .limit(1)
          .groupBy(UserSchema.id)

        data = _data[0]
      } else {
        const _data = await this.drizzleProvider.db.select({
          id: UserSchema.id,
          username: UserSchema.username,
          email: UserSchema.email,
          name: UserSchema.name,
          profilePicture: UserSchema.profilePicture,
          bio: UserSchema.bio,
          isVerified: UserSchema.isVerified,
          isPrivate: UserSchema.isPrivate,
        }).from(UserSchema)
          .where(eq(UserSchema.username, username)) // <- Update the condition here
          .limit(1)
          .groupBy(UserSchema.id)

        if (!_data[0].id) {
          throw new GraphQLError("An error occurred while fetching user profile")
        }

        data = {
          ..._data[0],
          friendship: {
            followed_by: false,
            following: false
          }
        }
      }

      if (!data?.id) {
        throw new GraphQLError("An error occurred while fetching user profile")
      }

      const followerCount = await this.drizzleProvider.db.select({
        count: count()
      }).from(FriendshipSchema).where(eq(FriendshipSchema.followingUserId, data.id))

      const followingCount = await this.drizzleProvider.db.select({
        count: count()
      }).from(FriendshipSchema).where(eq(FriendshipSchema.authorUserId, data.id))

      const postCount = await this.drizzleProvider.db.select({
        count: count()
      }).from(PostSchema).where(eq(PostSchema.authorId, data.id))

      // const followingList = [
      //   "259f9837-1514-4183-9157-bc1f1f504f0e",
      //   "72932765-a392-42eb-b936-d7a8ceb1a541",
      //   "e4a31dd8-13f9-4c8e-9e55-01baa79c3b5e"
      // ] // <- Update the following list here

      // const top_followers = await this.drizzleProvider.db.select({
      //   id: UserSchema.id,
      //   username: UserSchema.username,
      //   email: UserSchema.email,
      //   name:UserSchema.name,
      //   profilePicture: UserSchema.profilePicture,
      // })
      //   .from(FriendshipSchema)
      //   .leftJoin(UserSchema, eq(UserSchema.id, FriendshipSchema.authorUserId))
      //   .where(inArray(FriendshipSchema.authorUserId, followingList))

      return {
        ...data,
        postCount: postCount[0].count,
        followerCount: followerCount[0].count,
        followingCount: followingCount[0].count,
      }
    } catch (error) {
      Logger.error(error)
      throw new GraphQLError('Internal Server Error', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' }
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
        isPrivate: UserSchema.isPrivate,
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