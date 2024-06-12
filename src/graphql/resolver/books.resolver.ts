import { Resolver, Query } from '@nestjs/graphql';
import { Book } from '../model/book.model';
import { BooksService } from '../service/books.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guard/Gql-auth.guard';
@Resolver('Book')
export class BooksResolver {
    constructor(private booksService: BooksService) {}

    @Query(() => [Book]) // Explicit return type for getBooks query
    @UseGuards(GqlAuthGuard)
    async getBooks(): Promise<Book[]> { 
      return this.booksService.findAll();
    }
}
