import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../types/book';
import { environment } from '../../environment.prod';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/books`
httpclient = inject(HttpClient);
  constructor() { } 
  getBooks(page: number,params:String): Observable<any> {
    return this.httpclient.get(
      `${this.apiUrl}?page=${page}&${params}`
    );
  }
  getAllBooks(): Observable<any> {
    return this.httpclient.get(`${this.apiUrl}`);
  }
  getBookDetails(id: number): Observable<any> {
    return this.httpclient.get(`${this.apiUrl}/${id}`);
  }
  addBook(bookData: FormData): Observable<any> {
    return this.httpclient.post(`${this.apiUrl}`, bookData);
  }

  updateBook(id: number, bookData: FormData): Observable<any> {
    return this.httpclient.patch(`${this.apiUrl}/${id}`, bookData);
  }

  deleteBook(id: number): Observable<any> {
    return this.httpclient.delete(`${this.apiUrl}/${id}`);
  }
  
}
