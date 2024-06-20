import { Resolver, Query,Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { Users } from './entities/users.entity';
import { ProfileView } from './entities/profile.entity';
import { GqlAuthGuard } from 'src/auth/guard/Gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Users)
export class UsersResolver {
  private readonly usersService: UsersService
  constructor() { }

  // @Query(() => [Users], { name: 'users' })
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @UseGuards(GqlAuthGuard)
  // @Query(() => ProfileView, { name: 'profileView' })
  // findProfile(@Args('username', { type: () => String }) username: string) {
  //   return this.usersService.findProfile(username);
  // }
}
