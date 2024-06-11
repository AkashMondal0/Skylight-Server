import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
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
        throw new HttpException('User Not Found, User Create Failed', HttpStatus.NOT_FOUND)
      }
      return user[0];
    } catch (error) {
      Logger.error(error)
      throw new HttpException("User Create Failed", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  async findOneUserById(id: string): Promise<User[] | HttpException> {
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

      if (!user[0]) {
        return null
      }

      return user;
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
      }).from(users).where(eq(users.username, username))

      if (!user[0]) {
        return null;
      }
      return user[0];
    } catch (error) {
      Logger.error(error)
      return null;
    }
  }

}