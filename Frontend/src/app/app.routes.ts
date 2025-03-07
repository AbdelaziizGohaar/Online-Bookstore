import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { NotfoundComponent } from './components/notfound/notfound.component'
import { CartComponent } from './components/cart/cart.component';

export const routes: Routes = [
    {
        path: '',
        component: BookListComponent
    },

    {
        path: 'book-details/:id',
        component: BookDetailsComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'admin-dashboard',
        component: AdminDashboardComponent
    },
    {
        path: 'cart',
        component: CartComponent,
        title: 'Cart'
    },
    {
        path: '**',
        component: NotfoundComponent,
        title: 'Not Found Page'
    }
];
