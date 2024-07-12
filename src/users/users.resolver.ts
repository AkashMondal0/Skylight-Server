import { Resolver, Query, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { Users } from './entities/users.entity';
import { ProfileView } from './entities/profile.entity';
import { GqlAuthGuard } from 'src/auth/guard/Gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { SessionUserGraphQl } from 'src/decorator/session.decorator';
import { User } from 'src/types';
import { Author } from './entities/author.entity';

@Resolver(() => Users)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(GqlAuthGuard)
  @Query(() => ProfileView, { name: 'profileView' })
  findProfile(@SessionUserGraphQl() user: User, @Args('username', { type: () => String }) username: string) {
    return this.usersService.findProfile(user, username);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Author], { name: 'findUsersByKeyword' })
  findUsersByKeyword(@SessionUserGraphQl() user: User, @Args('keyword', { type: () => String }) keyword: string) {
    return this.usersService.findManyByUsernameAndEmail(keyword);
  }
}
