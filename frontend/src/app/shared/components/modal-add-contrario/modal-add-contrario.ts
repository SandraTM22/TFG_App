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

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      nif: [''],
      direccion: this.fb.group({
        calle: [''],
        numero: [''],
        cp: [''],
        localidad: [''],
        provincia: [''],
        pais: [''],
      }),
    });
  }

  save(): void {
    if (this.form.valid) {
      const contrario: Contrario = this.form.value;
      this.contrarioCreado.emit(contrario);
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancelForm(): void {
    this.cancelar.emit();
  }
}
