// src/app/services/cliente.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../interfaces/cliente';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private apiUrl = 'http://localhost:8000/cliente';

  constructor(private http: HttpClient) {}

  find(term: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/find?search=${term}`);
  }

  add(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }
}
