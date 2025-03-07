import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
httpclient = inject(HttpClient);
  constructor() { } 
  getBooks(): Observable<any> {
    return this.httpclient.get('http://localhost:3000/books');
  }
  
  getBookDetails(id: number): Observable<any> {
    return this.httpclient.get(`http://localhost:3000/books/${id}`);
  }
}
