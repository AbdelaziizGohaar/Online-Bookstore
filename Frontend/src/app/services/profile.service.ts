import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}`; // Base URL for API

  constructor(private http: HttpClient) { }

  // Fetch Login User Data 
  getDataOfAuthenticatedUser(): Observable<any> {
    return this.http.get<{ user: any }>(`${this.apiUrl}/users`).pipe(
      //map(response => response.orders), // Extract the `user` array
      tap((response) => console.log('API Response:', response)), // Debugging log
      catchError((error) => {
        console.error('API Error:', error); // Debugging log
        throw error;
      })
    );
  }

  updateUser(updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users`, updatedData);
  }

}
