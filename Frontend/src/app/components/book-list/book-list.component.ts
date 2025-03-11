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
  currentPage = 1;
  totalPages = 1;
  totalBooks = 0;
  ngOnInit() {
   this.loadBooks();
  }
  loadBooks() {
    this.bookService.getBooks(this.currentPage).subscribe((response) => {
      this.books = response.books.map((book : Book) => ({
        ...book,
        image: `${this.backendUrl}${book.image}` 
      }));
      this.totalPages = response.totalPages;
      this.totalBooks = response.totalBooks;
    });
  }
  changePage(page: number) {
    this.currentPage = page;
    this.loadBooks();
  }
}
