import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private apiUrl = 'http://localhost:8000/api/login';//Apunta al backend

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    console.log('Enviando datos al back desde auth:', email,password);  // Asegurar que los datos se está enviando correctamente
    return this.http.post<any>(this.apiUrl, { email, password });
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }
}