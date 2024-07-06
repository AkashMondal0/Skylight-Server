import { Resolver, Query, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { Users } from './entities/users.entity';
import { ProfileView } from './entities/profile.entity';
import { GqlAuthGuard } from 'src/auth/guard/Gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { SessionUserGraphQl } from 'src/decorator/session.decorator';
import { User } from 'src/types';

@Resolver(() => Users)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(GqlAuthGuard)
  @Query(() => ProfileView, { name: 'profileView' })
  findProfile(@SessionUserGraphQl() user: User, @Args('username', { type: () => String }) username: string) {
    return this.usersService.findProfile(user, username);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => ProfileView, { name: 'MyProfile' })
  MyProfile(@SessionUserGraphQl() user: User) {
    return user
  }
}
