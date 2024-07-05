import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DrizzleModule } from 'src/db/drizzle/drizzle.module';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [DrizzleModule],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule { }
