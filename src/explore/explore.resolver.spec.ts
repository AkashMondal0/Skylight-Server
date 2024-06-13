import { Test, TestingModule } from '@nestjs/testing';
import { ExploreResolver } from './explore.resolver';
import { ExploreService } from './explore.service';

describe('ExploreResolver', () => {
  let resolver: ExploreResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExploreResolver, ExploreService],
    }).compile();

    resolver = module.get<ExploreResolver>(ExploreResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
