import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive,ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  cartService = inject(CartService);
  cartItem: number = 0;
  searchControl = new FormControl('');
  constructor(private router: Router) { }
  ngOnInit(): void {
    this.cartService.cart$.subscribe((cart) => {
      if (cart) {
        this.cartItem = cart.totalItemNum;
      }
    });
    this.cartService.getCartItems();
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