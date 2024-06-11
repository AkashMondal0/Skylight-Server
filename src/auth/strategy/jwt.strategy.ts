import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import configuration from 'src/configs/configuration';
// import Redis from 'ioredis';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // private redisClient: Redis;
  constructor(
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration().JWT_SECRET,
    });
    // this.redisClient = new Redis(process.env.REDIS_URL)
  }

  // async validate(payload: any) {
  //   const tokenExists = await this.redisClient.get(payload.sub);
  //   if (!tokenExists) throw new UnauthorizedException();

  //   const user = JSON.parse(tokenExists);
  //   if (!user) throw new UnauthorizedException();
  //   return user;
  // }
}