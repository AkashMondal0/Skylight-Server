import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserPayload } from './auth.controller';
import { v4 as uuidv4 } from 'uuid';
import { RedisProvider } from 'src/db/redisio/redis.provider';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly redisProvider: RedisProvider
  ) {

  }

  async validateUser(username: string, pass: string): Promise<any> {
    // const user = await this.usersService.findOneByUsername(username);
    // if (user && await user.comparePassword(pass)) {
    //   return user;
    // }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    const jti = uuidv4(); // Unique token identifier
    await this.redisProvider.redisClient.set(jti, '1', 'EX', 60 * 60 * 24); // Store in Redis, expire in 1 day

    return {
      access_token: this.jwtService.sign(payload, { jwtid: jti }),
    };
  }
}