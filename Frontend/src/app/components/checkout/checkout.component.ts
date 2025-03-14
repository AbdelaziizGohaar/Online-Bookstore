import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../types/order';
import { CurrencyPipe } from '@angular/common';



@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CurrencyPipe, RouterLink], // Add CurrencyPipe to imports
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  paymentStatus: 'success' | 'failed' | 'pending' = 'pending';
  orderDetails: Order | null = null;
  metadata: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) { }

  async ngOnInit() {
    // Check the URL for payment status
    const url = this.router.url;

    if (url.includes('/checkout/success')) {
      this.paymentStatus = 'success';
      await this.fetchSessionMetadata(); // Fetch metadata from Stripe session

      // this.fetchOrderDetails();
    } else if (url.includes('/checkout/failed')) {
      this.paymentStatus = 'failed';
    } else {
      this.router.navigate(['/']); // Redirect to home if the URL is invalid
    }
  }

  async fetchSessionMetadata() {
    // Get the session_id from the URL
    const sessionId = this.route.snapshot.queryParams['session_id'];

    if (!sessionId) {
      console.error('No session_id found in the URL');
      return;
    }

    // Call the backend to create the order using the sessionId
    this.orderService.addOrderWithSession(sessionId).subscribe({
      next: (order) => {
        console.log('Order created successfully:', order);
        this.orderDetails = order; // Update the UI with the order details
      },
      error: (err) => {
        console.error('Failed to create order:', err);
      }
    });
  }



}
