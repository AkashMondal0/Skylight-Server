import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ExploreService } from './explore.service';
import { Explore } from './entities/explore.entity';
import { CreateExploreInput } from './dto/create-explore.input';
import { UpdateExploreInput } from './dto/update-explore.input';

@Resolver(() => Explore)
export class ExploreResolver {
  constructor(private readonly exploreService: ExploreService) {}

  @Mutation(() => Explore)
  createExplore(@Args('createExploreInput') createExploreInput: CreateExploreInput) {
    return this.exploreService.create(createExploreInput);
  }

  @Query(() => [Explore], { name: 'explore' })
  findAll() {
    return this.exploreService.findAll();
  }

  @Query(() => Explore, { name: 'explore' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.exploreService.findOne(id);
  }

  @Mutation(() => Explore)
  updateExplore(@Args('updateExploreInput') updateExploreInput: UpdateExploreInput) {
    return this.exploreService.update(updateExploreInput.id, updateExploreInput);
  }

  @Mutation(() => Explore)
  removeExplore(@Args('id', { type: () => Int }) id: number) {
    return this.exploreService.remove(id);
  }
}
