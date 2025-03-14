import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '../../types/book';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css'
})
export class BookCardComponent {
  cartService = inject(CartService);
  @Input() book !: Book;
  
  constructor(private router: Router) { 
  }
  redirectToBookDetails(id: number) {
    this.router.navigate(['/book-details', id]);
  }

  addToCart($event: Event, bookId: number): void {
    $event.stopPropagation();
    this.cartService.addItem(bookId);
    alert("item added to cart!");
  }
}
