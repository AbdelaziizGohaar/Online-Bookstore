import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap ,BehaviorSubject} from 'rxjs';

// for make AuthService avalibale in all project without need import it in providers
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'http://localhost:3000/users';

  private isLoggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private userRoleSubject = new BehaviorSubject<string | null>(localStorage.getItem('userRole') || null);
  userRole$ = this.userRoleSubject.asObservable();


//used for send requests to backend
  constructor(private http: HttpClient) {}
//send post req to users/ for create new user
  register(name:string, email:string, password:string, role:string):Observable<any>{
    //return user info after success operation 
    console.log(" Sending Register Request:", { name, email, password, role });
    return this.http.post(`${this.API_URL}` , {name ,email ,password ,role});
  }

  login(email: string, password: string): Observable<{ token: string }> { 
    return this.http.post<{ token: string }>(`${this.API_URL}/login`, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          this.saveToken(response.token);
          console.log("Token saved:", response.token);
          const role = this.getUserRole();
          if (role) {
            localStorage.setItem('userRole', role); 
            this.userRoleSubject.next(role);
          }
          this.userRoleSubject.next(role);
          this.isLoggedInSubject.next(true);
        }
      })
    );
  }
  

  saveToken(token:string):void{ 
    localStorage.setItem('token', token);
  }

  getToken():string | null{ 
    return localStorage.getItem('token');
  }
  // cheack if user login or not
// !! -> return true or false
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    this.userRoleSubject.next(null);
    this.isLoggedInSubject.next(false);
    
  }

  getUserRole(): string | null {
    const token = this.getToken();
    console.log('Token from localStorage:', token);//debug
    if (!token) return null;
  
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1])); 
      console.log('Decoded Token Payload:', tokenPayload);//debug
      return tokenPayload.role || null;  
    } catch (error) {
      console.error('Error decoding token:', error);//debug
      return null;
    }
  }

  refreshUserRole() {
    const role = localStorage.getItem('userRole');
    this.userRoleSubject.next(role);
  }
  
}


