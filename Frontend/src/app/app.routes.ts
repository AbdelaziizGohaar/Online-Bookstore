import { Routes } from '@angular/router';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';



export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then(
        (m) => m.HomeComponent
      ),
    title: 'Home | Booket'
  },
  {
    path: 'books',
    loadComponent: () =>
      import('./components/book-list/book-list.component').then(
        (m) => m.BookListComponent
      ),
    title: 'Books | Booket'
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./components/sign-up/signup.component').then(
        (m) => m.SignupComponent
      ),
    title: 'Signup'
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
      ), canActivate: [AdminGuard],
    title: 'DashBoard'
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./components/cart/cart.component').then((m) => m.CartComponent), canActivate: [AuthGuard],
    title: 'Cart'
  },
  {
    path: 'add-book',
    loadComponent: () =>
      import('./components/add-book/add-book.component').then(
        (m) => m.AddBookComponent
      ), canActivate: [AdminGuard],
    title: 'Add Book'
  },
  {
    path: 'edit-book/:id',
    loadComponent: () =>
      import('./components/edit-book/edit-book.component').then(
        (m) => m.EditBookComponent
      ), canActivate: [AdminGuard],
    title: 'Edit Book'
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./components/checkout/checkout.component').then(
        (m) => m.CheckoutComponent
      ), canActivate: [AuthGuard],
    title: 'Checkout'
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./components/profile/profile.component').then(
        (m) => m.ProfileComponent
      ), canActivate: [AuthGuard],
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
    path: 'checkout/success',
    component: CheckoutComponent
  },
  {
    path: 'checkout/failed',
    component: CheckoutComponent
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
