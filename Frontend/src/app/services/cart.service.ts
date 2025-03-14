import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Cart } from '../types/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:3000/cart';
  private cartSubject = new BehaviorSubject<Cart | null>(null);

  constructor(private http: HttpClient) {}

  get cart$(): Observable<Cart | null> {
    return this.cartSubject.asObservable();
  }

  private updateCart(cart: Cart): void {
    this.cartSubject.next(cart);
  }

  addItem(bookId: number): void {
    this.http.post<Cart>(`${this.apiUrl}/${bookId}`, {}).subscribe({
      next: (cart) => this.updateCart(cart),
      error: (err) => console.error('Failed to add item', err)
    });
  }

  getCartItems(): void {
    this.http.get<Cart>(`${this.apiUrl}`).subscribe({
      next: (cart) => this.updateCart(cart),
      error: (err) => console.error('Failed to load cart', err)
    });
  }

  updateItem(bookId: number, quantity: number): void {
    this.http.patch<Cart>(`${this.apiUrl}/${bookId}`, { quantity }).subscribe({
      next: (cart) => this.updateCart(cart),
      error: (err) => console.error('Failed to update item', err)
    });
  }

  removeItem(bookId: number): void {
    this.http.delete<Cart>(`${this.apiUrl}/${bookId}`).subscribe({
      next: (cart) => this.updateCart(cart),
      error: (err) => console.error('Failed to remove item', err)
    });
  }

  removeAllItem(): void {
    this.http.delete<Cart>(`${this.apiUrl}`).subscribe({
      next: (cart) => this.updateCart(cart),
      error: (err) => console.error('Failed to remove cart item', err)
    });
  }

  checkout(): Observable<{ checkoutSession: any }> {
    return this.http.post<{ checkoutSession: any }>(`http://localhost:3000/checkout`, {});
  }
}