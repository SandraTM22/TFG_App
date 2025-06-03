import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ProcuradorService } from '../../services/procurador.service';
import { Procurador } from '../../interfaces/procurador';
import { BtnComponent } from '../btn/btn.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-add-procurador',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BtnComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ErrorMessageComponent,
  ],
  templateUrl: './modal-add-procurador.html',
})
export class FormularioProcuradorComponent {
  @Output() procuradorCreado = new EventEmitter<Procurador>();
  @Output() cancelar = new EventEmitter<void>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private procuradorService: ProcuradorService,
    public toastService: ToastService
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido1: ['', Validators.required],
      apellido2: ['', Validators.required],
      colegio: ['', Validators.required],
      numeroColegiado: [null, [Validators.required, Validators.min(1)]],
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
    // Validar que todos los campos obligatorios estén ok:
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Obtener colegio y numeroColegiado del form:
    const colegio: string = this.form
      .get('colegio')!
      .value.trim()
      .toLowerCase();
    const numeroColegiado: number = this.form.get('numeroColegiado')!.value;

    // Llamar al servicio para ver si ya existe:
    this.procuradorService
      .existsByColegioAndNumero(colegio, numeroColegiado)
      .subscribe((exists) => {
        if (exists) {
          // Si ya existe, mostramos toast de error y no seguimos:
          this.toastService.showToast(
            'error',
            'Ya existe un procurador con ese colegio y número de colegiado.',
            3000
          );
          return;
        }

        // Si no existe, se guarad el procurador:
        const nuevo: Procurador = this.form.value;
        this.procuradorService.add(nuevo).subscribe((procurador) => {
          this.toastService.showToast(
            'success',
            'Procurador añadido correctamente',
            3000
          );
          this.procuradorCreado.emit(procurador);
          this.form.reset();
        });
      });
  }

  cancelForm() {
    this.cancelar.emit();
  }
}
