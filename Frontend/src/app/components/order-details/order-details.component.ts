import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../types/order';
import { CommonModule } from '@angular/common';
import { Book } from '../../types/book';
import { BookService } from '../../services/book.service';
import { environment } from '../../../environment.prod';

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
  backendUrl = `${environment.apiUrl}`;
  bookService = inject(BookService);
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

        this.order.books.forEach((book, index) => {
          this.bookService.getBookDetails(book.book_id).subscribe((data) => {
            this.order.books[index] = {
              ...book,
              book_name: data.title,
              image: `${environment.apiUrl}${data.image}`
            };
            console.log(this.order.books);
          });
        });
        this.isLoading = false; // Stop loading
      },
      error: (error) => {
        console.error('Error fetching order details:', error);
        this.isLoading = false; // Stop loading even if there's an error
      }
    });
  }
}