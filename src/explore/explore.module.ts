import { Module } from '@nestjs/common';
import { ExploreService } from './explore.service';
import { ExploreResolver } from './explore.resolver';
import { ExploreController } from './explore.controller';

@Module({
  providers: [ExploreResolver, ExploreService],
  controllers: [ExploreController],
})
export class ExploreModule {}
