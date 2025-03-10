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

export const routes: Routes = [
    {
        path: '',
        component: BookListComponent,
        title: 'Booket'
    },

    { path: 'login', 
        component: LoginComponent, 
        title: 'Login'
    },
    {
        path: 'login',
        component: LoginComponent
    },
  
    { path: 'register', 
        component: RegisterComponent,
        title: 'Register'
    },
    {
        path: 'register',
        component: RegisterComponent
    },

    {
        path: 'book-details/:id',
        component: BookDetailsComponent
    },

    {
        path: 'admin-dashboard',
        component: AdminDashboardComponent,
        title: 'DashBoard'
    },

    {
        path: 'cart',
        component: CartComponent,
        title: 'Cart'
    },

    {
        path: 'add-book',
        component: AddBookComponent
    },

    {
        path: 'edit-book/:id',
        component: EditBookComponent
    },

    {
        path: 'checkout',
        component: CheckoutComponent,
        title: 'Checkout'
    },

    {
        path: 'profile',
        component: ProfileComponent,
        title: 'Profile'
    },

    {
        path: 'orders',
        component: OrderListComponent
    },

    {
        path: 'orders/:id',
        component: OrderDetailsComponent
    },

    {
        path: '**',
        component: NotfoundComponent,
        title: 'Not Found Page'
    },

];
