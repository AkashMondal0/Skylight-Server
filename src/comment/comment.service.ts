import { and, desc } from 'drizzle-orm';
import { Injectable, Logger } from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
import { GraphQLError } from 'graphql';
import { CommentSchema, PostSchema, UserSchema } from 'src/db/drizzle/drizzle.schema';
import { User } from 'src/types';
import { CommentResponse } from 'src/types/response.type';
import { eq } from 'drizzle-orm';
import { FindCommentInput } from './dto/find-comment.input';

@Injectable()
export class CommentService {
  constructor(private readonly drizzleProvider: DrizzleProvider) { }

  async create(loggedUser: User, createCommentInput: CreateCommentInput): Promise<CommentResponse | GraphQLError> {
    try {
      const new_comment = await this.drizzleProvider.db.insert(CommentSchema).values({
        postId: createCommentInput.postId,
        content: createCommentInput.content,
        authorId: loggedUser.id
      }).returning()

      return {
        ...new_comment[0],
        user: loggedUser
      }
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


  async findAll(loggedUser: User, findCommentInput: FindCommentInput): Promise<CommentResponse[] | GraphQLError> {
    try {
      const comments = await this.drizzleProvider.db.select({
        id: CommentSchema.id,
        postId: CommentSchema.postId,
        content: CommentSchema.content,
        authorId: CommentSchema.authorId,
        createdAt: CommentSchema.createdAt,
        user: {
          id: UserSchema.id,
          username: UserSchema.username,
          email: UserSchema.email,
          profilePicture: UserSchema.profilePicture,
          name: UserSchema.name,
        }
      })
        .from(CommentSchema)
        .where(eq(CommentSchema.postId, findCommentInput.postId))
        .leftJoin(UserSchema, eq(CommentSchema.authorId, UserSchema.id))
        .orderBy(desc(CommentSchema.createdAt))
        .limit(10)
        .offset(0)
      return comments

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

  async update(loggedUser: User, CommentInput: UpdateCommentInput): Promise<{ status: boolean } | GraphQLError> {

    try {
      await this.drizzleProvider.db.update(CommentSchema)
        .set({
          content: "Updated Content"
        })
        .where(eq(CommentSchema.id, "e80a990c-e769-4a79-83d9-01988596fbdf"))

      return { status: true }

    } catch (error) {
      Logger.error(error)
      if (error instanceof GraphQLError) {
        throw error;
      } else {
        throw new GraphQLError('Internal Server Error (update comment)', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    }
  }

  async remove(loggedUser: User, commentId: string): Promise<{ status: boolean } | GraphQLError> {
    try {
      await this.drizzleProvider.db.delete(CommentSchema)
        .where(
          and(
            eq(CommentSchema.id, commentId),
            eq(CommentSchema.authorId, loggedUser.id)
          ))

      return { status: true }

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