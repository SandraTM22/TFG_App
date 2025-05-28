import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Expediente } from '../interfaces/expediente';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ExpedienteService {
  private apiUrl = 'http://localhost:8000/api/expedientes'; //Apunta al backend(entrada de los datos)

  constructor(private authService: AuthService, private http: HttpClient) {}

  // el subject interno
  private expedientesSubject = new BehaviorSubject<Expediente[]>([]);
  // el observable público
  expedientes$ = this.expedientesSubject.asObservable();

  /** Recarga los expedientes desde el backend y emite al subject */
  private refreshExps(): void {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Token no encontrado');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get<Expediente[]>(this.apiUrl, { headers }).subscribe(
      (exps) => this.expedientesSubject.next(exps),
      (err) => console.error('Error cargando expedientes', err)
    );
  }

  // Inicializa la carga
  init() {
    this.refreshExps();
  }

  /** Obtiene el observable de expedientes (no dispara petición) */
  getExp(): Observable<Expediente[]> {
    return this.expedientes$;
  }
}
