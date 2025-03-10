import { Routes } from '@angular/router';

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
            ),
        title: 'DashBoard'
    },
    {
        path: 'cart',
        loadComponent: () =>
            import('./components/cart/cart.component').then((m) => m.CartComponent),
        title: 'Cart'
    },
    {
        path: 'add-book',
        loadComponent: () =>
            import('./components/add-book/add-book.component').then(
              (m) => m.AddBookComponent
            ),
            title: 'Add Book'
    },
    {
        path: 'edit-book/:id',
        loadComponent: () =>
            import('./components/edit-book/edit-book.component').then(
              (m) => m.EditBookComponent
            ),
          title: 'Edit Book'
    },
    {
        path: 'checkout',
        loadComponent: () =>
            import('./components/checkout/checkout.component').then(
              (m) => m.CheckoutComponent
            ),
        title: 'Checkout'
    },
    {
        path: 'profile',
        loadComponent: () =>
            import('./components/profile/profile.component').then(
              (m) => m.ProfileComponent
            ),
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
