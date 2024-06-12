// book.model.ts
import { ObjectType, Field, Int } from '@nestjs/graphql';
import loggerMiddleware from '../middleware';

@ObjectType()
export class Book {
  @Field(() => Int,{ middleware: [loggerMiddleware] })
  id: number;

  @Field()
  title: string;

  @Field()
  author: string;
}
