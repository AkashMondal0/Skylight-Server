import { HttpException, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleProvider } from 'src/drizzle/drizzle.provider';
import { users } from 'src/drizzle/drizzle.schema';
import { User } from 'src/types';

@Injectable()
export class UsersService {
  constructor(private readonly drizzleProvider: DrizzleProvider) {}

  
  async findUserById(id: string): Promise<User[] | HttpException> {
    const user = await this.drizzleProvider.db.select().from(users)

    if (!user[0]) {
      return new HttpException('User not found', 404);
    }

    return user;
  }
}