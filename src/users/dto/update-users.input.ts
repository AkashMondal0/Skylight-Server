import { CreateUsersInput } from './create-users.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUsersInput extends PartialType(CreateUsersInput) {
  @Field(() => Int)
  id: number;
}
