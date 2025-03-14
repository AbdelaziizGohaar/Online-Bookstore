// import { Component, inject } from '@angular/core';
// import { RouterLink, RouterLinkActive } from '@angular/router';
// import { CartService } from '../../services/cart.service';

// @Component({
//   selector: 'app-header',
//   standalone: true,
//   imports: [RouterLink, RouterLinkActive],
//   templateUrl: './header.component.html',
//   styleUrl: './header.component.css'
// })
// export class HeaderComponent {
//   cartService = inject(CartService);
//   cartItem: number = 0;

//   ngOnInit(): void {
//     this.cartService.cart$.subscribe((cart) => {
//       if (cart) {
//         this.cartItem = cart.totalItemNum;
//       }
//     });
//     this.cartService.getCartItems();
//   }
// }  

import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive,ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  
  cartService = inject(CartService);
  authService = inject(AuthService);
  router = inject(Router);

  cartItem: number = 0;

  searchControl = new FormControl('');

  isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn$;
  userRole$: Observable<string | null> = this.authService.userRole$;
  

  //constructor(private router: Router) { }
  constructor() {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.userRole$ = this.authService.userRole$;

    this.authService.refreshUserRole();

    this.userRole$.subscribe(role => console.log('User Role from Observable:', role));
    this.isLoggedIn$.subscribe(status => console.log('Login Status:', status));

      this.cartService.cart$.subscribe(cart => {
      this.cartItem = cart ? cart.totalItemNum : 0;
    });
  }

  

  logout(): void {
    this.authService.logout();
   
    this.router.navigate(['/']);
  }

  search() {
    let searchString = '';
    if (this.searchControl.value) {
       searchString = this.searchControl.value.trim();
    } 
      this.router.navigate([], {
        queryParams: { search: searchString }
      });
    
  }
}


 


