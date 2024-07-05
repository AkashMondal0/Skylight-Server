import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipResolver } from './friendship.resolver';
import { FriendshipController } from './friendship.controller';
import { DrizzleModule } from 'src/db/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  providers: [FriendshipResolver, FriendshipService],
  controllers: [FriendshipController],
})
export class FriendshipModule {}
