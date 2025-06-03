import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Nota } from '../interfaces/nota';



@Injectable({
  providedIn: 'root'
})
export class NotasService {
  private readonly apiUrl = 'http://localhost:8000/api/nota';

  constructor(private http: HttpClient) {}

  getNotas(): Observable<Nota[]> {
    return this.http.get<Nota[]>(this.apiUrl);
  }

  getNota(id: number): Observable<Nota> {
    return this.http.get<Nota>(`${this.apiUrl}/${id}`);
  }

  add(nota: Partial<Nota>): Observable<Nota> {
    return this.http.post<Nota>(this.apiUrl, nota);
  }

  update(id: number, nota: Partial<Nota>): Observable<Nota> {
    return this.http.put<Nota>(`${this.apiUrl}/${id}`, nota);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
