import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../types/cart';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  cartService = inject(CartService);
  cartItem:number=0 ;
  
    
    ngOnInit(): void {
      this.cartService.getCartItems().subscribe({
        next: (cart) => this.cartItem = cart.totalItemNum,
        error: (err) => console.error('Failed to load cart', err)
      });
    }

}
