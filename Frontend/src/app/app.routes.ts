import { Routes } from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { LoginComponent } from './components/login/login.component';


export const routes: Routes = [
    {
        path: '',
        component: BookListComponent
    },

    {
        path: 'books-details/:id',
        component: BookDetailsComponent
    },

    { path: 'login', 
      component: LoginComponent 
    }
];
