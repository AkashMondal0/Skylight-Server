import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
import { friendship } from 'src/db/drizzle/drizzle.schema';
import { CreateFriendshipInput } from './dto/create-friendship.input';
import { GraphQLError } from 'graphql';
import { DestroyFriendship } from './dto/delete-friendship.input';
import { and, eq } from 'drizzle-orm';
import { Friendship } from 'src/types';

@Injectable()
export class FriendshipService {
  constructor(private readonly drizzleProvider: DrizzleProvider) { }

  async create(createFollowInput: CreateFriendshipInput): Promise<Friendship> {
    try {
      const check = await this.drizzleProvider.db.select().from(friendship).where(and(
        eq(friendship.followerUserId, createFollowInput.followerUserId),
        eq(friendship.followingUserId, createFollowInput.followingUserId)
      ))
        .limit(1)

      if (check.length > 0) {
        throw new GraphQLError('Already following user', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          }
        })
      }
      const data = await this.drizzleProvider.db.insert(friendship).values({
        followerUserId: createFollowInput.followerUserId,
        followingUserId: createFollowInput.followingUserId,
        followerUsername: createFollowInput.followerUsername,
        followingUsername: createFollowInput.followingUsername
      }).returning()

      return data[0];

    } catch (error) {
      Logger.error(error)
      if (error instanceof GraphQLError) {
        throw error;
      } else {
        throw new GraphQLError('Internal Server Error', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    }
  }

  // findAll() {
  //   return `This action returns all follow`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} follow`;
  // }

  // update(id: number, updateFollowInput: UpdateFollowInput) {
  //   return `This action updates a #${id} follow`;
  // }

  async deleteFriendship(destroyFriendship: DestroyFriendship): Promise<Friendship> {
    try {
      const data = await this.drizzleProvider.db.delete(friendship).where(and(
        eq(friendship.followingUserId, destroyFriendship.followingUserId),
        eq(friendship.followerUserId, destroyFriendship.followerUserId),
      )).returning()

      return data[0];
    } catch (error) {
      Logger.error(error)
      throw new GraphQLError('Error creating friendship')
    }
  }
}
