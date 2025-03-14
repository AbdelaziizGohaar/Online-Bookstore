import { inject, Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../types/review';



@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  httpclient = inject(HttpClient);
  constructor() { }
  getReviews(bookId: number): Observable<Review[]> {
    return this.httpclient.get<Review[]>(
      `http://localhost:3000/reviews?bookid=${bookId}`
    );
  }
}
