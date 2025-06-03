import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Juzgado } from '../../interfaces/juzgado';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BtnComponent } from '../btn/btn.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { JuzgadoService } from '../../services/juzgado.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-juzgado',
  templateUrl: './modal-add-juzgado.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    BtnComponent,
    ErrorMessageComponent,
  ],
})
export class FormularioJuzgadoComponent {
  @Output() juzgadoCreado = new EventEmitter<Juzgado>();
  @Output() cancelar = new EventEmitter<void>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private juzgadoService: JuzgadoService,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      // sub‐formulario “direccion”
      direccion: this.fb.group({
        calle: [''],
        numero: [null, Validators.min(1)],
        cp: ['', Validators.pattern(/^\d{5}$/)],
        localidad: [''],
        provincia: ['', [Validators.required]],
        pais: ['España', [Validators.required]],
      }),
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.juzgadoService.add(this.form.value).subscribe({
      next: (juzgado) => {
        this.toastService.showToast(
          'success',
          'juzgado añadido correctamente',
          3000
        );
        this.juzgadoCreado.emit(juzgado);
        this.form.reset();
      },
      error: (err: HttpErrorResponse) => {
        // Si viene un 400 con { errors: { campo: [...mensajes] } }
        if (err.status === 400 && err.error?.errors) {
          const backendErrors = err.error.errors;
          for (const campo in backendErrors) {
            const mensajes = backendErrors[campo];
            if (Array.isArray(mensajes)) {
              mensajes.forEach((msg: string) => {
                this.toastService.showToast('error', msg, 5000);
              });
            }
          }
        } else {
          const message =
            err.error?.message ||
            'Error inesperado al crear el juzgado. Inténtalo de nuevo.';
          this.toastService.showToast('error', message, 5000);
        }
      },
    });
  }

  cancelForm(): void {
    this.cancelar.emit();
  }
}
