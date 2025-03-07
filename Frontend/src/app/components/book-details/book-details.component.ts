import { Component, inject } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../types/book';


@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent {
  bookService = inject(BookService);
  route = inject(ActivatedRoute);
  book !: Book;
  constructor() {}
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.bookService.getBookDetails(id).subscribe((data) => {
        this.book = {
          ...data,
          image: `http://localhost:3000${data.image}`
        };
        
        console.log(this.book);
      });
    });
  }
}
