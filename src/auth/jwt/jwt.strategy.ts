import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import configuration from 'src/configs/configuration';
import Redis from 'ioredis';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private redisClient: Redis;
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration().JWT_SECRET,
    });
    this.redisClient = new Redis(process.env.REDIS_URL)
  }

  async validate(payload: any) {
    const tokenExists = await this.redisClient.exists(payload.jti);
    if (!tokenExists) throw new UnauthorizedException();

    const user = await this.userService.findOne(payload.sub);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}