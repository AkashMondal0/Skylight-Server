import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from './bcrypt/bcrypt.function';
import { RegisterUserPayload } from 'src/lib/validation/ZodSchema';
import { FastifyReply, FastifyRequest } from 'fastify';
import configuration from 'src/configs/configuration';
import { Author } from 'src/users/entities/author.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

  async signIn(response: FastifyReply, email: string, pass: string): Promise<Author | HttpException> {
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

    const accessToken = await this.jwtService.signAsync({
      username: user.username,
      id: user.id,
      email: user.email,
      name: user.name,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
      roles: user.roles,
    }, { expiresIn: '1d' })

    response.setCookie('auth-session-token', accessToken, {
      domain: configuration().DOMAIN,
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      priority: "medium"
    })
    return {
      ...user,
      accessToken: accessToken,
    };
  }

  async signUp(response: FastifyReply, body: RegisterUserPayload): Promise<Author | HttpException> {

    const user = await this.usersService.findOneByUsernameAndEmail(body.email, body.username);

    if (user) {
      // throw error user not found
      throw new HttpException('User Already Registered', HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.usersService.createUser(body);


    if (!newUser) {
      // throw error user not found
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // await this.redisProvider.redisClient.set(newUser.id, JSON.stringify(newUser), 'EX', 60 * 60 * 24 * 30); // seconds * minutes * hours * days

    const accessToken = await this.jwtService.signAsync({
      username: newUser.username,
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      profilePicture: newUser.profilePicture ?? '',
      createdAt: newUser.createdAt,
      roles: newUser.roles,
    }, { expiresIn: '1d' })

    response.setCookie('auth-session-token', accessToken, {
      domain: configuration().DOMAIN,
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      priority: "medium"
    })

    return {
      ...newUser,
      accessToken
    }
  }

  async signOut(request: FastifyRequest, response: FastifyReply): Promise<string | HttpException> {
    response.clearCookie('auth-session-token');
    return response.send("Logged Out Successfully")
  }
}