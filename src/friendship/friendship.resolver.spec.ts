import { Test, TestingModule } from '@nestjs/testing';
import { FriendshipResolver } from './friendship.resolver';
import { FriendshipService } from './friendship.service';

describe('FriendshipResolver', () => {
  let resolver: FriendshipResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FriendshipResolver, FriendshipService],
    }).compile();

    resolver = module.get<FriendshipResolver>(FriendshipResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
