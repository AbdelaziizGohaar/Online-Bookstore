import { Component, inject } from '@angular/core';

import { BookCardComponent } from '../book-card/book-card.component';
import { BookService } from '../../services/book.service';
import { Book } from '../../types/book';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [BookCardComponent],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent {
  bookService = inject(BookService);
  books !: Book[];
  backendUrl = 'http://localhost:3000'; 
  ngOnInit() {
    this.bookService.getBooks().subscribe((data : Book[]) => {
      this.books = data.map(book => ({
        ...book,
        image: `${this.backendUrl}${book.image}` 
      }));
    });
  }
}
