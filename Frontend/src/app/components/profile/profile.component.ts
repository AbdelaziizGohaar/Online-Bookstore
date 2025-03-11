import { Component } from '@angular/core';
import { OrderListComponent } from '../order-list/order-list.component'; // Import OrderListComponent
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, OrderListComponent], // Add OrderListComponent here
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  activeSection: string = 'account';

  setActiveSection(section: string) {
    this.activeSection = section;
  }
} 
