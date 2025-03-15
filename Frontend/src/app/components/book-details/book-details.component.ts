import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../types/book';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { ReviewComponent } from '../review/review.component';
import { environment } from '../../../environment.prod';



@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [FormsModule, ReviewComponent],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent {
  bookService = inject(BookService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  cartService = inject(CartService);
  book !: Book;
  constructor() {}
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.bookService.getBookDetails(id).subscribe((data) => {
        this.book = {
          ...data,
          image: `${environment.apiUrl}${data.image}`
        };
        
        console.log(this.book);
      });
    });
  }
  addToCart($event: Event, bookId: number): void {
    $event.stopPropagation();
    this.cartService.addItem(bookId);
  }
  backHome(){
    this.router.navigate(['/']);
  }
}
