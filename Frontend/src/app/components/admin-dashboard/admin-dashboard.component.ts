import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '../../types/book';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  books !: Book[];
  bookService = inject(BookService);
  backendUrl = 'http://localhost:3000'; 

  ngOnInit() {
    this.bookService.getBooks().subscribe((books: Book[]) => {
      this.books = books.map((book) => ({
        ...book,
        image: `${this.backendUrl}${book.image}`
      }));
    });
  }
  constructor(private router: Router) { }
  goToAddBook() {
    this.router.navigate(['/add-book']);
  }
  editBook(book: Book) {
    this.router.navigate(['/edit-book', book.book_id]);
  }
  deleteBook(bookId: number) {
    this.bookService.deleteBook(bookId).subscribe((res) => {
      console.log(res);
      if (res.error) {
        return alert(res.error);
      }
      alert('Book deleted successfully');
      this.books = this.books.filter((book) => book.book_id !==bookId);
    });
  }
}
