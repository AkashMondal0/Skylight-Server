import { Resolver, Query } from '@nestjs/graphql';
import { Book } from '../model/book.model';
import { BooksService } from '../service/books.service';
@Resolver('Book')
export class BooksResolver {
    constructor(private booksService: BooksService) {}

    @Query(() => [Book]) // Explicit return type for getBooks query
    async getBooks(): Promise<Book[]> { 
      return this.booksService.findAll();
    }
}
