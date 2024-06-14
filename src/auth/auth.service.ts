import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from './bcrypt/bcrypt.function';
import { RegisterUserPayload } from 'src/validation/ZodSchema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    // private redisProvider: RedisProvider
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);

    if (!user || !user.password) {
      // throw error user not found
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    const isPasswordMatching = await comparePassword(pass, user.password);

    if (!isPasswordMatching) {
      // throw error wrong credentials
      throw new HttpException('Wrong Credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByUsername(email);

    if (!user || !user.password) {
      // throw error user not found
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    const isPasswordMatching = await comparePassword(pass, user.password);

    if (!isPasswordMatching) {
      // throw error wrong credentials
      throw new HttpException('Wrong Credentials', HttpStatus.UNAUTHORIZED);
    }

    // await this.redisProvider.redisClient.set(user.id, JSON.stringify(user), 'EX', 60 * 60 * 24 * 30); // seconds * minutes * hours * days

    return {
      access_token: await this.jwtService.signAsync({
        username: user.username,
        id: user.id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        roles: user.roles,
      }, { expiresIn: '30d' }),
    };
  }

  async signUp(body: RegisterUserPayload): Promise<{ access_token: string }> {

    if (!body.username || !body.password || !body.email || !body.name) {
      // throw error user not found
      throw new HttpException('Missing Credential', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.findOneByUsername(body.username);

    if (user) {
      // throw error user not found
      throw new HttpException('User Already', HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.usersService.createUser(body);


    if (!newUser) {
      // throw error user not found
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // await this.redisProvider.redisClient.set(newUser.id, JSON.stringify(newUser), 'EX', 60 * 60 * 24 * 30); // seconds * minutes * hours * days

    return {
      access_token: await this.jwtService.signAsync({
        username: newUser.username,
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        profilePicture: newUser.profilePicture ?? '',
        createdAt: newUser.createdAt,
        roles: newUser.roles,
      }, { expiresIn: '30d' }),
    };
  }
}