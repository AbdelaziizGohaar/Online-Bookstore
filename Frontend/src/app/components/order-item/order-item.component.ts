import { Order } from '../../types/order';
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router'; // Import Router


@Component({
  selector: 'app-order-item',
  imports: [CommonModule], // Import CommonModule for Angular directives
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css']
})

export class OrderItemComponent {
  @Input() order!: Order; // Input property to receive order data
  @Output() delete = new EventEmitter<number>(); // Output property to emit delete event

  showModal: boolean = false; // Control modal visibility

  constructor(private router: Router) { } // Inject Router


  // Emit the delete event
  // onDelete(): void {
  //   this.delete.emit(this.order.order_id);
  // }


  // Emit the delete event
  onDelete(): void {
    this.showModal = true; // Show the modal
  }


  // Handle modal confirmation
  onConfirm(confirmed: boolean): void {
    this.showModal = false; // Hide the modal
    if (confirmed) {
      this.delete.emit(this.order.order_id); // Emit delete event if confirmed
    }
  }


  // Navigate to order details page
  navigateToOrderDetails(): void {
    this.router.navigate(['/orders', this.order.order_id]); // Navigate to order details
  }


}