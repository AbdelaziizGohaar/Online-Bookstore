import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Cart} from '../../types/cart';
import { RouterLink } from '@angular/router';
import { Book } from '../../types/book';


@Component({
  selector: 'app-cart',
  imports: [CommonModule,RouterLink ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})

export class CartComponent {

  cartService = inject(CartService);
  cart!: Cart ;

  
  ngOnInit(): void {
    this.cartService.getCartItems().subscribe({
      next: (cart) => this.cart = cart,
      error: (err) => console.error('Failed to load cart', err)
    });
  }

  addItem(bookId: number): void {
    this.cartService.addItem(bookId).subscribe({
      next: (cart) => this.cart = cart,
      error: (err) => console.error('Failed to add item', err)
    });
  }

  updateItem(bookId: number, quantity: number): void {
    this.cartService.updateItem(bookId, quantity).subscribe({
      next: (cart) => this.cart = cart,
      error: (err) => console.error('Failed to update item', err)
    });
  }

  removeItem(bookId: number): void {
    this.cartService.removeItem(bookId).subscribe({
      next: (cart) => this.cart = cart,
      error: (err) => console.error('Failed to remove item', err)
    });
  }
}
