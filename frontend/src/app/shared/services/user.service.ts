import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8000/admin/users'; //Apunta al backend(entrada de los datos)

  constructor(private http: HttpClient, private authService: AuthService) {}

  //Observable: emitirá los datos de los usuarios al completarse la solicitud. Esto permite trabajar con los datos de forma asíncrona.
  getUsers(): Observable<User[]> {
     // Obtener el token del localStorage
     const token = this.authService.getToken();
     if (!token) {
       throw new Error('Token no encontrado');
     }
     // Configurar las cabeceras con el token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User[]>(this.apiUrl, { headers });
  }

  addUser(user: User): Observable<User[]> {
    const token = this.authService.getToken();
     if (!token) {
       throw new Error('Token no encontrado');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<User[]>(this.apiUrl, user, { headers });
  }

  updateUser(user: User): Observable<User[]> {
    return this.http.put<User[]>(`${this.apiUrl}/${user.id}`, user);
  }

  deleteUser(id: number): Observable<User[]> {
    return this.http.delete<User[]>(`${this.apiUrl}/${id}`);
  }

  // Funcion para filtrar segun lo que haya en el termino de busqueda(aun por implantar)
  searchTasks(searchTerm: string): Observable<User[]> {
    if (!searchTerm) {
      return this.getUsers();
    }
    // Filtrar usuarios que coinciden con el término de búsqueda (correo electrónico)
    return this.getUsers().pipe(
      //this.getUsers() devuelve un Observable, por lo que los datos deben transformarse mediante map().
      map((users) =>
        users.filter((user) =>
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }
}
