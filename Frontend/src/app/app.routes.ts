import { Routes } from '@angular/router';

import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { NotfoundComponent } from './components/notfound/notfound.component'
import { CartComponent } from './components/cart/cart.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { EditBookComponent } from './components/edit-book/edit-book.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ProfileComponent } from './components/profile/profile.component'
import { OrderListComponent } from './components/order-list/order-list.component'
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';


export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./components/book-list/book-list.component').then(
              (m) => m.BookListComponent
            ),
        title: 'Booket'
    },
    { path: 'login', 
        loadComponent: () =>
            import('./components/login/login.component').then(
              (m) => m.LoginComponent
            ), 
        title: 'Login'
    },
    { path: 'register', 
        loadComponent: () =>
            import('./components/register/register.component').then(
              (m) => m.RegisterComponent
            ), 
        title: 'Register'
    },
    {
        path: 'book-details/:id',
        loadComponent: () =>
            import('./components/book-details/book-details.component').then(
              (m) => m.BookDetailsComponent
            ),
            title: 'Book Details'
    },
    {
        path: 'admin-dashboard',
        loadComponent: () =>
        import('./components/admin-dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
            ),canActivate: [AdminGuard],
        title: 'DashBoard'
    },
    {
        path: 'cart',
        loadComponent: () =>
        import('./components/cart/cart.component').then((m) => m.CartComponent),canActivate: [AuthGuard],
        title: 'Cart'
    },
    {
        path: 'add-book',
        loadComponent: () =>
        import('./components/add-book/add-book.component').then(
          (m) => m.AddBookComponent
         ),canActivate: [AdminGuard],
        title: 'Add Book'
    },
    {
        path: 'edit-book/:id',
        loadComponent: () =>
        import('./components/edit-book/edit-book.component').then(
          (m) => m.EditBookComponent
         ),canActivate: [AdminGuard],
        title: 'Edit Book'
    },
    {
        path: 'checkout',
        loadComponent: () =>
            import('./components/checkout/checkout.component').then(
              (m) => m.CheckoutComponent
            ),canActivate: [AuthGuard],
        title: 'Checkout'
    },
    {
        path: 'profile',
        loadComponent: () =>
            import('./components/profile/profile.component').then(
              (m) => m.ProfileComponent
            ),canActivate: [AuthGuard],
        title: 'Profile'
    },
    {
        path: 'orders',
        loadComponent: () =>
            import('./components/order-list/order-list.component').then(
              (m) => m.OrderListComponent
            ),
          title: 'Orders'
    },
    {
        path: 'orders/:id',
        loadComponent: () =>
            import('./components/order-details/order-details.component').then(
              (m) => m.OrderDetailsComponent
            ),
          title: 'Order Details'
    },
    {
        path: '**',
        loadComponent: () =>
            import('./components/notfound/notfound.component').then(
              (m) => m.NotfoundComponent
            ),
        title: 'Not Found Page'
    },

];
