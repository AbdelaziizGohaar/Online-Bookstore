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

import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive,ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);
 // router = inject(Router);

  cartItem: number = 0;

  isLoggedIn: boolean = false;


  searchControl = new FormControl('');
  constructor(private router: Router) { }

  ngOnInit(): void {
    //debug
  console.log('User Logged In:', this.authService.isAuthenticated()); //update
  console.log('Cart Items:', this.cartService.getCartItems()); //update
    this.cartService.cart$.subscribe(cart => {
      this.cartItem = cart ? cart.totalItemNum : 0;
      console.log('Updated Cart Items:', this.cartItem);
    });
    this.cartService.getCartItems();


    this.isLoggedIn = this.authService.isAuthenticated();
  }


  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
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


 


