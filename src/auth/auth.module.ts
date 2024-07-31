import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategy/local.strategy';
import configuration from 'src/configs/configuration';
import { RedisModule } from 'src/db/redis/redis.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    RedisModule,
    JwtModule.register({
      global: true,
      secret: configuration().JWT_SECRET,
      signOptions: { expiresIn: "30d" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }