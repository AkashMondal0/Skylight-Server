import { Injectable, Logger } from '@nestjs/common';
import { eq, like, or } from 'drizzle-orm';
import { createHash } from 'src/auth/bcrypt/bcrypt.function';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
import { users } from 'src/db/drizzle/drizzle.schema';
import { User } from 'src/types';
import { RegisterUserPayload } from 'src/validation/ZodSchema';

@Injectable()
export class UsersService {
  constructor(
    private readonly drizzleProvider: DrizzleProvider
  ) { }

  async createUser(userCredential: RegisterUserPayload): Promise<User | null> {

    const hashPassword = await createHash(userCredential.password)

    try {
      const newUser = await this.drizzleProvider.db.insert(users).values({
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
        id: users.id,
        username: users.username,
        name: users.name,
        email: users.email,
        profilePicture: users.profilePicture,
        password: users.password,
        bio: users.bio,
        createdAt: users.createdAt,
        accessToken: users.accessToken,
        roles: users.roles
      }).from(users)
        .where(eq(users.id, id))
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
        id: users.id,
        username: users.username,
        name: users.name,
        email: users.email,
        profilePicture: users.profilePicture,
        password: users.password,
        bio: users.bio,
        createdAt: users.createdAt,
        accessToken: users.accessToken,
        roles: users.roles
      })
        .from(users)
        .where(eq(users.email, email))
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
  //     const user = await this.drizzleProvider.db.update(users).set({
  //       username: userCredential.username,
  //       password: hashPassword,
  //       name: userCredential.name,
  //       email: userCredential.email,
  //       bio: userCredential.bio,
  //       profilePicture: userCredential.profilePicture,
  //       roles: userCredential.roles
  //     })
  //       .where(eq(users.username, userCredential.username))
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
  //     await this.drizzleProvider.db.delete(users)
  //       .where(eq(users.id, id))
  //     return true
  //   } catch (error) {
  //     Logger.error(error)
  //     return false
  //   }
  // }

  
  async findManyByUsernameAndEmail(keywords: string): Promise<User[] | []> {
    try {
      const data = await this.drizzleProvider.db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        name: users.name,
        profilePicture: users.profilePicture,
        bio: users.bio,
        isVerified: users.isVerified,
        isPrivate: users.isPrivate,
      }).from(users).where(
        or(
          like(users.username, `%${keywords}%`),
          like(users.name, `%${keywords}%`)
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