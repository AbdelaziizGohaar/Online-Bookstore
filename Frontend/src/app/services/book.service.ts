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
  getBooks(page: number): Observable<any> {
    return this.httpclient.get(
      `http://localhost:3000/books?page=${page}`
    );
  }
  getAllBooks(): Observable<any> {
    return this.httpclient.get('http://localhost:3000/books');
  }
  getBookDetails(id: number): Observable<any> {
    return this.httpclient.get(`http://localhost:3000/books/${id}`);
  }
  addBook(bookData: FormData): Observable<any> {
    return this.httpclient.post('http://localhost:3000/books', bookData);
  }

  updateBook(id: number, bookData: FormData): Observable<any> {
    return this.httpclient.patch(`http://localhost:3000/books/${id}`, bookData);
  }

  deleteBook(id: number): Observable<any> {
    return this.httpclient.delete(`http://localhost:3000/books/${id}`);
  }
  
}
