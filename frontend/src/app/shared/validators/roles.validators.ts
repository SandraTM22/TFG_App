import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


//allowed roles
const allowed_roles = ["ROLE_ADMIN", "ROLE_USER", "ROLE_USER_LIMITED"]


export function RolesValidator(): ValidatorFn {
  //returns a control that is going to be ValidationErrors or null
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || control.value.length === 0) {
      return { required: true }; // Si no hay roles seleccionados, marcarlo como "requerido"
    }

    // Verifica que todos los roles estén en el conjunto permitido
    const invalidRoles = control.value.filter((role: string) => !allowed_roles.includes(role));

    if (invalidRoles.length > 0) {
      return { invalidRoles: true }; // Si hay roles inválidos, retornar el error
    }

    return null; // Si todo es válido, no hay errores
  };
}
