import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Costa } from '../interfaces/costa';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CostaService {
  private apiUrl = 'http://localhost:8000/costas'; //Apunta al backend(entrada de los datos)

  constructor(
    private authService: AuthService,
  ) {}

  // el subject interno
  private costasSubject = new BehaviorSubject<Costa[]>([]);
  // el observable público
  costas$ = this.costasSubject.asObservable();


  getCostas(): Observable<Costa[]>{
    // Obtener el token del localStorage
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token no encontrado');
    }
    // Configurar las cabeceras con el token
    return this.costas$;
  }

}
