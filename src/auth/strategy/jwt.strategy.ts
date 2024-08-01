import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import configuration from 'src/configs/configuration';
import { Users } from 'src/users/entities/users.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration().JWT_SECRET,
    });
  }

  async validate(payload: Users) {
    return { 
      id: payload.id, 
      username: payload.username,
      email: payload.email,
      name: payload.name,
      profilePicture: payload.profilePicture,
      createdAt: payload.createdAt,
      roles: payload.roles,
     };
  }
}