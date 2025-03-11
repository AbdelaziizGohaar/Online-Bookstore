import { Component, inject } from '@angular/core';
import { BookCardComponent } from '../book-card/book-card.component';
import { BookService } from '../../services/book.service';
import { Book } from '../../types/book';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [BookCardComponent,FormsModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent {
  bookService = inject(BookService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  books: Book[] = [];
  backendUrl = 'http://localhost:3000'; 
  currentPage = 1;
  totalPages = 1;
  totalBooks = 0;
  paramsString: string = '';
  selectedPrice = 250;
  minPrice: number = 0;
  maxPrice: number = 100;
  filterByPrice() {
    this.currentPage = 1;
    if (!this.minPrice) this.minPrice = 0;
    if (!this.maxPrice) this.maxPrice = 100;
    this.router.navigate([], {
      queryParams: { minPrice: this.minPrice, maxPrice: this.maxPrice }
    });
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      if (params.hasOwnProperty('search')) {  // Ensures 'search' exists
        console.log('searching');
      let searchQuery = params['search'] ? `title=${params['search']}` : '';
        this.paramsString = searchQuery;
      if (!params['page']) {
        this.currentPage = 1;
      }
      }
      if (!params['page']) {
        this.currentPage = 1;
      }
      if (params['minPrice'] || params['maxPrice']) {

        this.paramsString = `minPrice=${params['minPrice']}&maxPrice=${params['maxPrice']}`;
      }
      this.loadBooks();
    });
  }

  loadBooks() {
    this.bookService.getBooks(this.currentPage, this.paramsString).subscribe((response) => {
      this.books = response.books.map((book: Book) => ({
        ...book,
        image: `${this.backendUrl}${book.image}` 
      }));
      this.totalPages = response.totalPages;
      this.totalBooks = response.totalBooks;
    });
  }

  changePage(page: number) {
    this.currentPage = page;
    this.router.navigate([], { queryParams: { page: this.currentPage }, queryParamsHandling: 'merge' });
    this.loadBooks();
  }
  isFilterDisabled(): boolean {
    return !(this.minPrice !== null && this.maxPrice !== null && this.minPrice >= 0 && this.maxPrice >= 0);
  }
  
}
