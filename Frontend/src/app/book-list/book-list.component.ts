import { Component, inject } from '@angular/core';
import { BookService } from '../services/book.service';
import { Book } from '../types/book';
import { BookCardComponent } from '../book-card/book-card.component';

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
  ngOnInit() {
    this.bookService.getBooks().subscribe((data) => {
      this.books = data;      
    });
  }
}
