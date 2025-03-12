import { Component } from '@angular/core';
import { OrderListComponent } from '../order-list/order-list.component'; // Import OrderListComponent
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../services/profile.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, OrderListComponent, ReactiveFormsModule],
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

  updateForm: FormGroup; // Form group for updating user data
  isUpdating: boolean = false; // Loading state during update
  successMessage: string = ''; // Add this variable



  constructor(private profileService: ProfileService, private fb: FormBuilder) {

    // Initialize the update form
    this.updateForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8)]]
    });

  }


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


  //============================================

  // Handle form submission
  onUpdate(): void {
    if (this.updateForm.invalid) {
      this.errorMessage = 'Please fill out the form correctly.';
      return;
    }

    this.isUpdating = true;
    this.errorMessage = '';

    const updatedData = this.updateForm.value;

    // Call the update service
    this.profileService.updateUser(updatedData).subscribe({
      next: (response) => {
        this.isUpdating = false;
        this.fetchUserData(); // Refresh user data after update
        console.log('User updated successfully:', response);
        // Switch to the Account Info section after successful update
        this.activeSection = 'account';
        this.successMessage = 'User updated successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.isUpdating = false;
        this.errorMessage = 'Failed to update user. Please try again.';
        console.error('Update error:', error);
      }
    });
  }

  //============================================

  activeSection: string = 'account';

  setActiveSection(section: string) {
    this.activeSection = section;
  }
} 
