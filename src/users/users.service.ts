import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
import { users } from 'src/db/drizzle/drizzle.schema';
import { User } from 'src/types';

type UserCredential = {
  username: string;
  password: string;
  name: string;
  email: string;
}

type SkyApiResponse<Data> = {
  message: string;
  data: Data
}
@Injectable()
export class UsersService {
  constructor(
    private readonly drizzleProvider: DrizzleProvider
  ) { }

  // async CreateUser(userCredential: UserCredential): Promise<SkyApiResponse<User | string>> {
  //   const user = await this.drizzleProvider.db.select().from(users)


  // }


  async findUserById(id: string): Promise<User[] | HttpException> {
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
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND)
    }

    return user;
  }

  async findOneByUsername(username: string): Promise<User | null> {
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
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND)
    }

    return user[0];
  }
}