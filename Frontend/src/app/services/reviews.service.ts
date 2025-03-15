import { inject, Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../types/review';
import { environment } from '../../environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private apiUrl = `${environment.apiUrl}/reviews`; // Base URL for API
  
  httpclient = inject(HttpClient);
  constructor() { }
  getReviews(bookId: number): Observable<Review[]> {
    return this.httpclient.get<Review[]>(
      `${this.apiUrl}?bookid=${bookId}`
    );
  }
}
