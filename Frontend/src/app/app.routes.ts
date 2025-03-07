import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';


export const routes: Routes = [
    {
        path: '',
        component: BookListComponent
    },

    {
        path: 'book-details/:id',
        component: BookDetailsComponent
    },

    { path: 'login', 
      component: LoginComponent 
    }
];
