import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/login'; //Apunta al backend

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {    
    return this.http.post<any>(this.apiUrl, { email, password },{ withCredentials: false });
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/']);
  }

  //Función para comprobar si el token a expirado
  isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now().valueOf() / 1000;
      return decoded.exp < now;
    } catch (error) {
      return true; // si no se puede decodificar, lo tratamos como inválido
    }
  }

  //Función para comprobar los roles
  hasAnyRole(roles: string[]): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decoded: any = jwtDecode(token);
    return roles.some((role) => decoded.roles?.includes(role));
  }
}
