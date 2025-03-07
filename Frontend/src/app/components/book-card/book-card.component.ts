import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '../../types/book';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css'
})
export class BookCardComponent {
  @Input() book !: Book;
  constructor(private router: Router) { 
  }
  redirectToProductDetails(id: number) {
    this.router.navigate(['/book-details', id]);
  }
  addToCart(event: Event, book: Book): void {
    event.stopPropagation(); // Prevents the card's click event
    // this.cartService.addProduct(product);
  }
}
