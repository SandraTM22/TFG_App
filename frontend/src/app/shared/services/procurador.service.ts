import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Procurador } from '../interfaces/procurador';

@Injectable({ providedIn: 'root' })
export class ProcuradorService {
  private apiUrl = 'http://localhost:8000/api/procurador';

  constructor(private http: HttpClient) {}

  find(term: string): Observable<Procurador[]> {
    return this.http.get<Procurador[]>(`${this.apiUrl}/find?search=${term}`);
  }

  add(procurador: Procurador): Observable<Procurador> {
    return this.http.post<Procurador>(this.apiUrl, procurador);
  }

  existsByColegioAndNumero(colegio: string, numero: number): Observable<boolean> {
    const params = new HttpParams()
      .set('colegio', colegio)
      .set('numero', numero.toString());

    return this.http
      .get<{ exists: boolean }>(`${this.apiUrl}/exists`, { params })
      .pipe(map(response => response.exists));
  }
}
