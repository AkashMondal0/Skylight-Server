import { Injectable, Logger } from '@nestjs/common';
import { eq, like, or } from 'drizzle-orm';
import { createHash } from 'src/auth/bcrypt/bcrypt.function';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
import { UserSchema } from 'src/db/drizzle/drizzle.schema';
import { User } from 'src/types';
import { RegisterUserPayload } from 'src/validation/ZodSchema';

@Injectable()
export class UsersService {
  constructor(
    private readonly drizzleProvider: DrizzleProvider
  ) { }

  async createUser(userCredential: RegisterUserPayload): Promise<User | null> {

    const salt = `${Math.random().toString(36).substring(2, 15)}`
    const hashPassword = await createHash(userCredential.password + salt)

    try {
      const newUser = await this.drizzleProvider.db.insert(UserSchema).values({
        username: userCredential.username,
        password: hashPassword,
        salt: salt,
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
        salt: UserSchema.salt,
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

  // async updateUser(userCredential: User): Promise<User | null> {

  //   const hashPassword = await createHash(userCredential.password)

  //   try {
  //     const user = await this.drizzleProvider.db.update(UserSchema).set({
  //       username: userCredential.username,
  //       password: hashPassword,
  //       name: userCredential.name,
  //       email: userCredential.email,
  //       bio: userCredential.bio,
  //       profilePicture: userCredential.profilePicture,
  //       roles: userCredential.roles
  //     })
  //       .where(eq(UserSchema.username, userCredential.username))
  //       .returning()

  //     if (!user[0]) {
  //       return null;
  //     }
  //     return user[0];
  //   } catch (error) {
  //     Logger.error(error)
  //     return null
  //   }
  // }

  // async deleteUser(id: string): Promise<boolean> {
  //   try {
  //     await this.drizzleProvider.db.delete(UserSchema)
  //       .where(eq(UserSchema.id, id))
  //     return true
  //   } catch (error) {
  //     Logger.error(error)
  //     return false
  //   }
  // }



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

}