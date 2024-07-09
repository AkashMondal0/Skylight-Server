import { Injectable, Logger } from '@nestjs/common';
import { CreateLikeInput } from './dto/create-like.input';
import { UpdateLikeInput } from './dto/update-like.input';
import { User } from 'src/types';
import { GraphQLError } from 'graphql';
import { LikeSchema } from 'src/db/drizzle/drizzle.schema';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class LikeService {
  constructor(private readonly drizzleProvider: DrizzleProvider) { }
  async create(sessionUser: User, postId: string): Promise<{ like: boolean } | GraphQLError> {
    try {
      const check = await this.drizzleProvider.db.select({
        id: LikeSchema.id
      }).from(LikeSchema).where(and(
        eq(LikeSchema.authorId, sessionUser.id),
        eq(LikeSchema.postId, postId)
      )).limit(1)

      if (check.length > 0) {
        return {
          like: true,
        }
      }

      await this.drizzleProvider.db.insert(LikeSchema).values({
        authorId: sessionUser.id,
        postId: postId
      })
      return {
        like: true,
      };

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

  findAll() {
    return `This action returns all like`;
  }

  findOne(id: number) {
    return `This action returns a #${id} like`;
  }

  update(id: number, updateLikeInput: UpdateLikeInput) {
    return `This action updates a #${id} like`;
  }

  async remove(sessionUser: User, postId: string): Promise<{ like: boolean } | GraphQLError> {
    try {
     
      await this.drizzleProvider.db.delete(LikeSchema).where(and(
        eq(LikeSchema.authorId, sessionUser.id),
        eq(LikeSchema.postId, postId)
      ))
      return {
        like: false,
      };

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
}
