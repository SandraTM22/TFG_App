import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contrario } from '../interfaces/contrario';

@Injectable({
  providedIn: 'root'
})
export class ContrarioService {
  private apiUrl = 'http://localhost:8000/api/contrario'; 

  constructor(private http: HttpClient) {}

  find(term: string): Observable<Contrario[]> {
      return this.http.get<Contrario[]>(`${this.apiUrl}/find?search=${term}`);
    }

  getAll(): Observable<Contrario[]> {
    return this.http.get<Contrario[]>(this.apiUrl);
  }

  getById(id: number): Observable<Contrario> {
    return this.http.get<Contrario>(`${this.apiUrl}/${id}`);
  }

  add(contrario: Contrario): Observable<Contrario> {
    return this.http.post<Contrario>(this.apiUrl, contrario);
  }

  update(id: number, contrario: Contrario): Observable<Contrario> {
    return this.http.put<Contrario>(`${this.apiUrl}/${id}`, contrario);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
