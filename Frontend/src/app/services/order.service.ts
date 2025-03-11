import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../types/order'; // Ensure the path to your Order model is correct
import { map, tap, catchError } from 'rxjs/operators';

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

  // Fetch orders for a specific user by user_id
  getOrdersByUserId(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/users`, {
      params: { user_id: userId.toString() } // Pass user_id as a query parameter
    });
  }

  // Fetch all orders for the authenticated user
  // getOrdersForAuthenticatedUser(): Observable<Order[]> {
  //   return this.http.get<Order[]>(`${this.apiUrl}/users`);
  // }


  getOrdersForAuthenticatedUser(): Observable<Order[]> {
    return this.http.get<{ orders: Order[] }>(`${this.apiUrl}/users`).pipe(
      map(response => response.orders), // Extract the `orders` array
      tap((response) => console.log('API Response:', response)), // Debugging log
      catchError((error) => {
        console.error('API Error:', error); // Debugging log
        throw error;
      })
    );
  }


}