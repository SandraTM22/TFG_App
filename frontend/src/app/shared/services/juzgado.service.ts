import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Juzgado } from '../interfaces/juzgado';

@Injectable({ providedIn: 'root' })
export class JuzgadoService {
  private apiUrl = 'http://localhost:8000/api/juzgado';

  constructor(private http: HttpClient) {}

  find(term: string): Observable<Juzgado[]> {
    return this.http.get<Juzgado[]>(`${this.apiUrl}/find?search=${term}`);
  }

  add(juzgado: Juzgado): Observable<Juzgado> {
    return this.http.post<Juzgado>(this.apiUrl, juzgado);
  }
}
