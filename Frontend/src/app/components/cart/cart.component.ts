import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../types/cart';
import { BookService } from '../../services/book.service';
import { Book } from '../../types/book';
import { RouterLink } from '@angular/router';
import { CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  cartService = inject(CartService);
  cart!: Cart;

  bookService = inject(BookService);
  books: { [key: number]: Book } = {};

  ngOnInit(){
    this.cartService.getCartItems();
    this.cartService.cart$.subscribe((cart) => {
      if (cart) {
        this.cart = cart;
        this.cart.arrayOfBooks.forEach((item) => {
          this.bookService.getBookDetails(item.book_id).subscribe((data) => {
            this.books[item.book_id] = {
              ...data,
              image: `http://localhost:3000${data.image}`
            };
          });
        });
      }
    });
  }

  getSubtotal(): number {
    if (!this.cart || !this.cart.arrayOfBooks) return 0;
    return this.cart.arrayOfBooks.reduce((total, item) => {
      const book = this.books[item.book_id];
      if (book) {
        return total + (book.price * item.booknum);
      }
      return total;
    }, 0);
  }

  updateItem(bookId: number, quantity: number): void {
    this.cartService.updateItem(bookId, quantity);
  }

  removeItem(bookId: number): void {
    this.cartService.removeItem(bookId);
  }

  onCheckout() {
    this.cartService.checkout().subscribe({
      next: (response) => {
        window.location.href = response.checkoutSession.url;
      },
      error: (err) => console.error('Checkout failed', err),
    });
  }
}