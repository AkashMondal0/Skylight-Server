import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DrizzleModule } from 'src/db/drizzle/drizzle.module';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [DrizzleModule, UsersResolver, UsersService],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule { }
