import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Costa } from '../interfaces/costa';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CostaService {
  private apiUrl = 'http://localhost:8000/api/costas'; //Apunta al backend(entrada de los datos)

  constructor(private authService: AuthService, private http: HttpClient) {}

  // el subject interno donde almacenamos el array de costas
  private costasSubject = new BehaviorSubject<Costa[]>([]);
  // el observable público al que se pueden subscribir los componentes
  costas$ = this.costasSubject.asObservable();

  public refreshCostas() {
    this.http
      .get<Costa[]>(`${this.apiUrl}/custom`)
      .subscribe((costas) => this.costasSubject.next(costas));
  }

  /**
   * Inicializa la carga desde el componente
   */
  init(): void {
    this.refreshCostas();
  }

  /**
   * Devuelve el observable con la lista de costas
   * ¡OJO! No dispara ninguna petición, solo devuelve el observable actual.
   */
  getCostas(): Observable<Costa[]> {
    return this.costas$;
  }

  add(costa: Costa): Observable<Costa> {
    return this.http.post<Costa>(this.apiUrl, costa);
  }

  updateCosta(id: number, payload: Omit<Costa, 'id'>): Observable<Costa> {
    return this.http.put<Costa>(`${this.apiUrl}/${id}`, payload);
  }

  deleteCosta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
