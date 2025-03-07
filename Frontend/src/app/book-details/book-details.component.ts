import { Component, inject } from '@angular/core';
import { BookService } from '../services/book.service';
import { Book } from '../types/book';
import { ActivatedRoute } from '@angular/router';


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
        this.book = data;
        console.log(this.book);
      });
    });
  }
}
