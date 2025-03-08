import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../types/book';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent {
  bookService = inject(BookService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  book !: Book;
  quantity : number = 1;
  constructor() {}
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
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
  increaseQuantity(){
    this.quantity++;
    console.log(this.quantity);
  }

  decreaseQuantity(){
    if(this.quantity > 1){
      this.quantity--;
    }
    console.log(this.quantity);
  }
  backHome(){
    this.router.navigate(['/']);
  }
}
