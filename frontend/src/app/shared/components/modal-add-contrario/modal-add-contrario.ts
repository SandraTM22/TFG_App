import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Contrario } from '../../interfaces/contrario';
import { BtnComponent } from '../btn/btn.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { ContrarioService } from '../../services/contrario.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-contrario',
  imports: [
    ReactiveFormsModule,
    BtnComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ErrorMessageComponent,
  ],
  templateUrl: './modal-add-contrario.html',
})
export class FormularioContrarioComponent {
  @Output() contrarioCreado = new EventEmitter<Contrario>();
  @Output() cancelar = new EventEmitter<void>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private contrarioService: ContrarioService,
    private toastService : ToastService
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      nif: [''],
      direccion: this.fb.group({
        calle: [''],
        numero: [''],
        cp: [''],
        localidad: [''],
        provincia: ['', Validators.required],
        pais: ['', Validators.required],
      }),
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.contrarioService.add(this.form.value).subscribe({
      next: (contrario) => {
        this.toastService.showToast(
          'success',
          'Contrario añadido correctamente',
          3000
        );
        this.contrarioCreado.emit(contrario);
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
            'Error inesperado al crear el contrario. Inténtalo de nuevo.';
          this.toastService.showToast('error', message, 5000);
        }
      },
    });
  }

  cancelForm(): void {
    this.cancelar.emit();
  }
}
