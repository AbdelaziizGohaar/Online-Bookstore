import { Component, inject } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../types/book';
import { ActivatedRoute, Router } from '@angular/router';
import { BookCardComponent } from '../book-card/book-card.component';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environment.prod';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BookCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  featuredBooks: Book[] = [];
  libraryBooks: Book[] = [];
  isLoading: boolean = true; // Loading state
  backendUrl = `${environment.apiUrl}`;
  constructor(private bookService: BookService, private router: Router) { }

  ngOnInit() {
    this.loadFeaturedBooks();
    this.loadLibraryBooks();
  }

  // Fetch featured books dynamically
  loadFeaturedBooks() {
    this.bookService.getAllBooks().subscribe((response: Book[]) => {
      this.featuredBooks = response.slice(0, 5);
      this.featuredBooks = this.featuredBooks.map((book: Book) => ({
      ...book,
      image: `${this.backendUrl}${book.image}`
      }));
      this.isLoading = false;
    });
  }

  // Fetch featured books dynamically
  loadLibraryBooks() {
    this.bookService.getAllBooks().subscribe((response: any) => {
      this.libraryBooks = response.slice(7, 11);
      this.libraryBooks = this.libraryBooks.map((book: Book) => ({
      ...book,
      image: `${this.backendUrl}${book.image}`
      }));
      this.isLoading = false;
    });
  }


  // Navigate to the book list page
  navigateToBookList() {
    this.router.navigate(['/books']);
  }
}
