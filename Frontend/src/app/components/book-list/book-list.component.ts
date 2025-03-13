import { Component, inject } from '@angular/core';
import { BookCardComponent } from '../book-card/book-card.component';
import { BookService } from '../../services/book.service';
import { Book } from '../../types/book';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [BookCardComponent, FormsModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent {
  bookService = inject(BookService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  books: Book[] = [];
  // featuredBooks: Book[] = [];
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

    // this.loadFeaturedBooks(); // Load featured books dynamically
  }


  // loadFeaturedBooks() {
  //   this.bookService.getAllBooks().subscribe((response: any) => {
  //     this.featuredBooks = response.slice(0, 5); // Take the first 7 books
  //     console.log('Featured Books:', this.featuredBooks);
  //   });
  // }


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



  // featuredBooks: Book[] = [
  //   {
  //     book_id: 1,
  //     title: 'Prizoner Of Zenda',
  //     author: 'Rachel Kushner',
  //     description: 'A captivating story about...',
  //     price: 25.99,
  //     stock: 10,
  //     image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEOB-4pxOD9XvkL7a-7l4RDx9D6mDM9f_pQw&s'
  //   },
  //   {
  //     book_id: 2,
  //     title: 'Frankenstein',
  //     author: 'Alice McDermott',
  //     description: 'A timeless classic about...',
  //     price: 29.99,
  //     stock: 5,
  //     image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCjl6w1MEvwYzftlCTmxsAtZ9bQFo3fDTxNQ&s'
  //   },
  //   {
  //     book_id: 3,
  //     title: 'The Lord of the Rings',
  //     author: 'Fuman Alam',
  //     description: 'A gripping tale of...',
  //     price: 22.99,
  //     stock: 8,
  //     image: 'https://harpercollins.co.uk/cdn/shop/files/x9780008537760_668991cc-5323-4f83-8c89-0052afc21a23.jpg?v=1741251116&width=350'
  //   },
  //   {
  //     book_id: 4,
  //     title: 'War and Peace',
  //     author: 'Leo Tolstoy',
  //     description: 'A story of ambition and...',
  //     price: 19.99,
  //     stock: 15,
  //     image: 'https://m.media-amazon.com/images/I/81oHM-dzefL.jpg'
  //   },
  //   {
  //     book_id: 5,
  //     title: 'One Hundred Years of Solitude',
  //     author: 'Gabriel García Márquez',
  //     description: 'A story of ambition and...',
  //     price: 29.99,
  //     stock: 15,
  //     image: 'https://www.alpiedelaletralibreria.com/imagenes/9780241/978024196858.JPG'
  //   },
  //   {
  //     book_id: 6,
  //     title: 'Animal Farm',
  //     author: 'George Orwell',
  //     description: 'A story of ambition and...',
  //     price: 11.94,
  //     stock: 15,
  //     image: 'https://prodimage.images-bn.com/pimages/9789390909001_p0_v1_s600x595.jpg'
  //   }
  // ];


}
