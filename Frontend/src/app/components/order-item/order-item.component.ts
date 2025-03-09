import { Order } from '../../types/order';
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-order-item',
  imports: [CommonModule], // Import CommonModule for Angular directives
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css']
})

export class OrderItemComponent {
  @Input() order!: Order; // Input property to receive order data
  @Output() delete = new EventEmitter<number>(); // Output property to emit delete event

  // Emit the delete event
  onDelete(): void {
    this.delete.emit(this.order.order_id);
  }
}