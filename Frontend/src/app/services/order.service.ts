import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../types/order'; // Ensure the path to your Order model is correct

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/orders'; // Base URL for orders API

  constructor(private http: HttpClient) { }

  // Fetch all orders
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  // Fetch details of a specific order by ID
  getOrderDetails(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  // Add a new order
  addOrder(orderData: FormData): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, orderData);
  }

  // Update an existing order by ID
  updateOrder(id: number, orderData: FormData): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}`, orderData);
  }

  // Delete an order by ID
  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}