import { Injectable } from '@angular/core';
import { Toast } from '../interfaces/toast';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  //ejemploPropiedad = 'Ejemplo desde servicio';
  constructor() {}

  toasts: Toast[] = [];
  //inicializamos una de las popiedades de toast
  private toastId = 0;

  addToast(
    type: 'success' | 'error' | 'info' | 'warning',
    message: string,
    duration: number = 3000
  ) {
    const id = this.toastId++;
    this.toasts.push({ id, type, message });

    // Eliminar el toast después del tiempo especificado
    setTimeout(() => {
      this.removeToast(id);
    }, duration);
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter((toast) => toast.id !== id); //Crea un nuevo array
  }
}
