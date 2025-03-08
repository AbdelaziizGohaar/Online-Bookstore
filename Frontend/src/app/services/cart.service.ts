import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart, CartItem} from '../types/cart';
import { Book } from '../types/book';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:3000/cart';

  constructor(private http: HttpClient) {}

  addItem(bookId: number): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/${bookId}`, {});
  }

  getCartItems(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}`);
  }

  updateItem(bookId: number, quantity: number): Observable<Cart> {
    return this.http.patch<Cart>(`${this.apiUrl}/${bookId}`, { quantity });
  }

  removeItem(bookId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/${bookId}`);
  }
}
