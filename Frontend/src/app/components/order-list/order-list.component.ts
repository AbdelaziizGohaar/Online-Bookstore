import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../types/order';
import { OrderItemComponent } from '../order-item/order-item.component'; // Import OrderItemComponent
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-list',
  imports: [CommonModule, OrderItemComponent], // Add OrderItemComponent here
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})

export class OrderListComponent implements OnInit {
  orders: Order[] = []; // Array to store orders
  isLoading: boolean = true; // Loading state
  errorMessage: string = ''; // Error message


  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    // this.fetchOrders();
    // const userId = 14; // Replace with the actual user ID (e.g., from authentication)
    // this.fetchUserOrders(userId);
    this.fetchOrdersForAuthenticatedUser();
  }


  // Fetch orders for the authenticated user
  fetchOrdersForAuthenticatedUser(): void {
    this.orderService.getOrdersForAuthenticatedUser().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false; // Stop loading
      },
      error: (error) => {
        this.errorMessage = 'Failed to fetch orders. Please try again later.';
        this.isLoading = false; // Stop loading even if there's an error
      }
    });
  }


  // Fetch orders for a specific user
  fetchUserOrders(userId: number): void {
    this.orderService.getOrdersByUserId(userId).subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false; // Stop loading
      },
      error: (error) => {
        this.errorMessage = 'Failed to fetch orders. Please try again later.';
        this.isLoading = false; // Stop loading even if there's an error
      }
    });
  }
 

  // Fetch all orders
  fetchOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false; // Stop loading
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
        this.isLoading = false; // Stop loading even if there's an error
      }
    });
  }
 
  // Delete an order
  deleteOrder(id: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(id).subscribe({
        next: () => {
          console.log('Order deleted successfully');
          // Refresh the order list
          this.fetchOrders();
        },
        error: (error) => {
          console.error('Error deleting order:', error);
        }
      });
    }
  }
}