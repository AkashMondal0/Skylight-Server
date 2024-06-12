import { Injectable, Logger } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { createHash } from 'src/auth/bcrypt/bcrypt.function';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
import { users } from 'src/db/drizzle/drizzle.schema';
import { User } from 'src/types';

type UserCredential = {
  username: string;
  password: string;
  name: string;
  email: string;
}

interface UpdateCredential extends UserCredential {
  bio: string;
  profilePicture: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly drizzleProvider: DrizzleProvider
  ) { }

  async createUser(userCredential: UserCredential): Promise<User | null> {

    const hashPassword = await createHash(userCredential.password)

    try {
      const user = await this.drizzleProvider.db.insert(users).values({
        username: userCredential.username,
        password: hashPassword,
        name: userCredential.name,
        email: userCredential.email,
      }).returning()

      if (!user[0]) {
        return null;
      }
      return user[0];
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

  async findOneByUsername(username: string): Promise<User | null> {
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
      })
        .from(users)
        .where(eq(users.username, username))
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

  async updateUser(userCredential: UpdateCredential): Promise<User | null> {

    const hashPassword = await createHash(userCredential.password)

    try {
      const user = await this.drizzleProvider.db.update(users).set({
        username: userCredential.username,
        password: hashPassword,
        name: userCredential.name,
        email: userCredential.email,
        bio: userCredential.bio,
        profilePicture: userCredential.profilePicture,
      })
        .where(eq(users.username, userCredential.username))
        .returning()

      if (!user[0]) {
        return null;
      }
      return user[0];
    } catch (error) {
      Logger.error(error)
      return null
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      await this.drizzleProvider.db.delete(users)
        .where(eq(users.id, id))
      return true
    } catch (error) {
      Logger.error(error)
      return false
    }
  }


}