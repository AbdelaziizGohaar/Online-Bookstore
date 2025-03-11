import { Component } from '@angular/core';
import { OrderListComponent } from '../order-list/order-list.component'; // Import OrderListComponent
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../services/profile.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, OrderListComponent], // Add OrderListComponent here
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  Userdata: any = {}; // Store the entire user data object
  email: string = '';
  name: string = '';
  role: string = '';
  avatar: string = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJSlf6uTYNHvKhfSht74y0Pz4VvLv-gdhFvQ&s'; // Add this property for the avatar URL
  isLoading: boolean = true; // Loading state
  errorMessage: string = ''; // Error message

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.fetchUserData();
  }

  // Fetch user data 
  fetchUserData(): void {
    this.profileService.getDataOfAuthenticatedUser().subscribe({
      next: (data) => {
        this.Userdata = data; // Store the entire user data object
        this.email = data.email; // Extract email
        this.name = data.name; // Extract name
        this.role = data.role; // Extract role
        this.isLoading = false; // Stop loading
        console.log('Api data of user:', this.Userdata);
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        this.isLoading = false; // Stop loading even if there's an error
      }
    });
  }


  activeSection: string = 'account';

  setActiveSection(section: string) {
    this.activeSection = section;
  }
} 
