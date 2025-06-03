import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Nota } from '../../interfaces/nota';
import { ToastService } from '../../services/toast.service';
import { NotasService } from '../../services/notas.service';
import { BtnComponent } from '../btn/btn.component';

@Component({
  selector: 'app-nota-form',
  imports: [ReactiveFormsModule, BtnComponent],
  templateUrl: './modal-notas.html',
})
export class NotaFormComponent implements OnChanges {
  @Input() nota: Nota | null = null;
  @Input() costaId?: number;

  @Output() guardada = new EventEmitter<Nota>();
  @Output() cancelada = new EventEmitter<void>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notasService: NotasService,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      contenido: ['', [Validators.required, Validators.maxLength(1000)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nota'] && this.nota) {
      this.form.patchValue({
        contenido: this.nota.contenido || '',
      });
    }
  }

  save() {
    if (this.form.invalid) return;

    // Construir el JSON (payload)
    const payload: any = {
      contenido: this.form.value.contenido,
    };

    // Si "nota" es null se esta creando nota nueva.
    //    En ese caso, debemos pasar además el campo "costa" en el JSON.
    if (!this.nota && this.costaId != null) {
      payload.costa = this.costaId;
    }

    const request$ = this.nota
      ? this.notasService.update(this.nota.id!, payload)
      : this.notasService.add(payload);

    request$.subscribe({
      next: (notaGuardada) => {
        this.toastService.showToast('success', 'Nota guardada correctamente');
        this.guardada.emit(notaGuardada);
      },
      error: (err) => {
        console.error('Error al guardar nota:', err);
        this.toastService.showToast('error', 'Error al guardar la nota');
      },
    });
  }

  cancel() {
    this.cancelada.emit();
  }
}
