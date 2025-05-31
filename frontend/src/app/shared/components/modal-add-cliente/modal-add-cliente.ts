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

  constructor(private fb: FormBuilder, private clienteService: ClienteService) {
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

  guardar() {
    if (this.form.valid) {
      this.clienteService.add(this.form.value).subscribe((cliente) => {
        this.clienteCreado.emit(cliente);
        this.form.reset();
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancelarFormulario() {
    this.cancelar.emit();
  }
}
