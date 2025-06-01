import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../interfaces/cliente';
import { BtnComponent } from '../btn/btn.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-cliente',
  imports: [
    ReactiveFormsModule,
    BtnComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ErrorMessageComponent,
  ],
  templateUrl: './modal-add-cliente.html',
})
export class FormularioClienteComponent {
  @Output() clienteCreado = new EventEmitter<Cliente>();
  @Output() cancelar = new EventEmitter<void>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido1: ['', Validators.required],
      apellido2: ['', Validators.required],
      dni: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?:[0-9]{8}|[XYZxyz][0-9]{7})[A-Za-z]$/),
        ],
      ],
      referencia: [''],
      direccion: this.fb.group({
        calle: [''],
        numero: [null, Validators.min(1)],
        cp: [null, Validators.pattern(/^\d{5}$/)],
        localidad: [''],
        provincia: ['', Validators.required],
        pais: ['España', Validators.required],
      }),
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.clienteService.add(this.form.value).subscribe({
      next: (cliente) => {
        this.toastService.addToast(
          'success',
          'Cliente añadido correctamente',
          3000
        );
        this.clienteCreado.emit(cliente);
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
                this.toastService.addToast('error', msg, 5000);
              });
            }
          }
        } else {
          const message =
            err.error?.message ||
            'Error inesperado al crear el cliente. Inténtalo de nuevo.';
          this.toastService.addToast('error', message, 5000);
        }
      },
    });
  }

  cancelForm() {
    this.cancelar.emit();
  }
}
