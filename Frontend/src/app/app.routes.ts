import { Routes } from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
import { BookDetailsComponent } from './book-details/book-details.component';


export const routes: Routes = [
    {
        path: '',
        component: BookListComponent
    },

    {
        path: 'products-details/:id',
        component: BookDetailsComponent
    }
];
