import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { Cart, CartItem} from '../../types/cart';
import { Book } from '../../types/book';


@Component({
  selector: 'app-cart',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})

export class CartComponent implements OnInit {
  cart: Cart | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
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
