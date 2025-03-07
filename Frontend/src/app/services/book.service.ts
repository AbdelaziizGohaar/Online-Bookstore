import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../types/book';

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
  addBook(book: Book): Observable<any> {
    return this.httpclient.post('http://localhost:3000/books', book);
  }
  deleteBook(id: number): Observable<any> {
    return this.httpclient.delete(`http://localhost:3000/books/${id}`);
  }
  updateBook(id: number, data: any): Observable<any> {
    return this.httpclient.put(`http://localhost:3000/books/${id}`, data);
  }
}
