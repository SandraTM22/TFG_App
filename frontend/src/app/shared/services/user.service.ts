import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8000/admin/users'; //Apunta al backend(entrada de los datos)

  constructor(private http: HttpClient) {}
  //Observable:  will emit the users when the request is completed. This allows you to work with the data asynchronously.
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  addUser(user: User): Observable<User[]> {
    return this.http.post<User[]>(this.apiUrl, user);
  }

  updateUser(user: User): Observable<User[]> {
    return this.http.put<User[]>(`${this.apiUrl}/${user.id}`, user);
  }

  deleteUser(id: number): Observable<User[]> {
    return this.http.delete<User[]>(`${this.apiUrl}/${id}`);
  }

  // Function to filter based on the search value
  searchTasks(searchTerm: string): Observable<User[]> {
    if (!searchTerm) {
      return this.getUsers();
    }
    // Filter user that match the search term (email)
    return this.getUsers().pipe(
      //this.getUsers() returns an Observable, so the data must be transformed using map().
      map((users) =>
        users.filter((user) =>
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }
}
