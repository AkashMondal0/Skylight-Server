import { CreateExploreInput } from './create-explore.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateExploreInput extends PartialType(CreateExploreInput) {
  @Field(() => Int)
  id: number;
}
