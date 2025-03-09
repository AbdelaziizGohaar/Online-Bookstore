import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../types/order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule], // Import CommonModule here
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  order!: Order; // Order details
  isLoading: boolean = true; // Loading state

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id'); // Get order ID from URL
    if (orderId) {
      this.fetchOrderDetails(+orderId); // Convert string to number
    }
  }

  // Fetch order details
  fetchOrderDetails(id: number): void {
    this.orderService.getOrderDetails(id).subscribe({
      next: (data) => {
        this.order = data;
        this.isLoading = false; // Stop loading
      },
      error: (error) => {
        console.error('Error fetching order details:', error);
        this.isLoading = false; // Stop loading even if there's an error
      }
    });
  }
}