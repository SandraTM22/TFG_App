import { AbstractControl, ValidationErrors } from '@angular/forms';

export function EmailValidator(control: AbstractControl): ValidationErrors | null {
  
  const value = control.value;

  if (!value) return null;

  const emailPatternDomain = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/i;

  return emailPatternDomain.test(value) ? null : { invalidEmail: true };
}
