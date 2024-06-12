import { Injectable } from '@nestjs/common';
import { Book } from '../model/book.model';

@Injectable()
export class BooksService {
    private books: Book[] = [
        { id: 1, title: 'The Awakening', author: 'Kate Chopin' },
        { id: 2, title: 'City of Glass', author: 'Paul Auster' },
    ]; // Sample book data

    findAll() {
        return this.books;
    }
}
