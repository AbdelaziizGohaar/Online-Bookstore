 import { Component } from '@angular/core';
 import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule, FormControl } from '@angular/forms';
 import { CommonModule } from '@angular/common';
 import { trigger, state, style, transition, animate } from '@angular/animations';
 import { AuthService } from '../../services/auth.service';
 import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./signup.component.css'] ,

  animations: [
    trigger('slideAnimation', [
      state('login', style({ transform: 'translateX(0%)', opacity: 1 })),
      state('register', style({ transform: 'translateX(0%)', opacity: 1 })),

      transition('login => register', [
        animate('0.9s ease-in-out', style({ transform: 'translateX(-100%)', opacity: 0 })),
        animate('0.9s ease-in-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ]),

      transition('register => login', [
        animate('0.9s ease-in-out', style({ transform: 'translateX(100%)', opacity: 0 })),
        animate('0.9s ease-in-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ])
    ])
  ]
})
export class SignupComponent {
  isLoginMode = true; 
  errorMessage: string = '';
  isLoading: boolean = false;
  loginForm: FormGroup;
  registerForm: FormGroup;
  isPasswordVisible: boolean = false;
   isConfirmPasswordVisible: boolean = false;
   formSubmitted: boolean = false;

   constructor( 
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) {
            
        this.loginForm = this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          password: ['', [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)
          ]]
        });
    
       
        this.registerForm = this.fb.group(
          {
            name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [
              Validators.required, 
              Validators.minLength(8), 
              Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]],
            confirmPassword: ['', Validators.required],
          },
          { validator: this.passwordMatchValidator }
        );


       
      
      }


      register() {
        this.formSubmitted = true;
    
        if (this.registerForm.invalid){
          
          return;
        }
        this.errorMessage = '';
        this.isLoading = true;
    
    
        const { name, email, password } = this.registerForm.value;
    
        this.authService.register(name, email, password, 'Customer').subscribe({
          next: () => {
            this.isLoading = false;

          
           this.router.navigate(['/']);

          },
          error: (error) => {
            this.isLoading = false;
            console.error(" Registration Error:", error);
            console.error(" Error Details:", error.error);
            this.errorMessage = error?.error?.message || 'Registration failed!';
          },
        });
      }

      login() {
        const email = this.loginForm.value.email.trim(); 
        const password = this.loginForm.value.password.trim();
      
       
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) {
          console.error("Invalid email format!");
          this.errorMessage = "Invalid email format. Please enter a valid email address.";
          return;
        }
      
        this.authService.login(email, password).subscribe({
          next: (response) => {
            console.log('Login Response:', response);
            this.authService.saveToken(response.token);
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.warn("Login error:", error);
          }
        });
      }
      

  toggleMode() {
    this.isLoginMode = !this.isLoginMode; 
  }
  get animationState() {
    return this.isLoginMode ? 'login' : 'register';
  }

 

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  
  toggleConfirmPasswordVisibility() {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }
}
