import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { Users } from './entities/users.entity';
import { CreateUsersInput } from './dto/create-users.input';
import { UpdateUsersInput } from './dto/update-users.input';

@Resolver(() => Users)
export class UsersResolver {
  private readonly usersService: UsersService
  constructor() {}

  // @Mutation(() => Users)
  // createUsers(@Args('createUsersInput') createUsersInput: CreateUsersInput) {
  //   return this.usersService.create(createUsersInput);
  // }

  // @Query(() => [Users], { name: 'users' })
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Query(() => Users, { name: 'user' })
  // findOne(@Args('id', { type: () => Int }) id: string) {
  //   return this.usersService.findOneUserById(id);
  // }

  // @Mutation(() => Users)
  // updateUsers(@Args('updateUsersInput') updateUsersInput: UpdateUsersInput) {
  //   return this.usersService.update(updateUsersInput.id, updateUsersInput);
  // }

  // @Mutation(() => Users)
  // removeUsers(@Args('id', { type: () => Int }) id: number) {
  //   return this.usersService.remove(id);
  // }
}
