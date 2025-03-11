import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)
      ]]
    });
  }

  login() {
    if (this.loginForm.invalid) return;
    this.errorMessage = '';
    this.isLoading = true; 

    const email = this.loginForm.value.email.trim(); 
    const password = this.loginForm.value.password.trim();

    this.authService.login(email, password).subscribe({
      next: (response) => {
        // for cheack if token send with login
        console.log('Login Response:', response);
        this.authService.saveToken(response.token);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.warn("Login error:", error); 
        this.errorMessage = error.error.message || 'Login failed';
      },
      complete: () => {
        this.isLoading = false; 
      }
    });
  }
}
