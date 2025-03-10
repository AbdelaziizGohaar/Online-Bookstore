import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../types/cart';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  cartService = inject(CartService);
  cart!: Cart;

  ngOnInit(): void {
    this.cartService.getCartItems();
    this.cartService.cart$.subscribe((cart) => {
      if (cart) {
        this.cart = cart;
      }
    });
  }

  updateItem(bookId: number, quantity: number): void {
    this.cartService.updateItem(bookId, quantity);
  }

  removeItem(bookId: number): void {
    this.cartService.removeItem(bookId);
  }
}