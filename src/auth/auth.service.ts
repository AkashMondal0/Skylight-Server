import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from './bcrypt/bcrypt.function';
import { RegisterUserPayload } from 'src/lib/validation/ZodSchema';
import { FastifyReply, FastifyRequest } from 'fastify';
import configuration from 'src/configs/configuration';
import { Users } from 'src/users/entities/users.entity';
import { UserSchema } from 'src/db/drizzle/drizzle.schema';
import { eq, or } from 'drizzle-orm';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly drizzleProvider: DrizzleProvider
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {

    const user = await this.findOneByUsername(username);

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

  // 
  async signIn(response: FastifyReply, email: string, pass: string): Promise<Users | HttpException> {
    const user = await this.findOneByUsername(email);

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

  async signUp(response: FastifyReply, body: RegisterUserPayload): Promise<Users | HttpException> {

    const user = await this.findOneByUsernameAndEmail(body.email, body.username);

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
    for (const [key] of Object.entries(request.cookies)) {
      response.clearCookie(key)
    }
    return response.send("Logged Out Successfully")
  }

  // 
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

}