import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { debounceTime, switchMap, map, first } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProcuradorService } from '../services/procurador.service';

export function ProcuradorValidator(procuradorService: ProcuradorService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    const colegio = control.get('colegio')?.value;
    const numeroColegiado = control.get('numeroColegiado')?.value;

    if (!colegio || !numeroColegiado) {
      return of(null); // no validamos si falta info
    }

    return of(null).pipe(
      debounceTime(300),
      switchMap(() =>
        procuradorService.existsByColegioAndNumero(
          (colegio as string).toLowerCase(), 
          Number(numeroColegiado)
        ).pipe(
          map((exists) => (exists ? { colegioNumeroExiste: true } : null)),
          first()
        )
      )
    );
  };
}
