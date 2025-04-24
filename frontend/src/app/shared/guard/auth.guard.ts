import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  //Acceso a los servicios
  const authService = inject(AuthService);
  const router = inject(Router);

  //los roles experados vendra en la data
  const expectedRoles = route.data?.['roles'] as string[] | undefined;

  // Si no está autenticado, redirige al login 
  if (!authService.isAuthenticated()) {
    console.log('No está autenticado. Redirigiendo al login.');
    router.navigate(['/']);
    return false;
  }

   // Si tiene roles definidos pero el usuario no los tiene -> no está autorizado   
   if (expectedRoles && !authService.hasAnyRole(expectedRoles)) {
    console.log('No tiene los roles adecuados. Redirigiendo a Unauthorized.');
    router.navigate(['/unauthorized']);
    return false;
  }

  //Si ha pasado todos los filtros, permitimos la navegación
  console.log('Acceso permitido.');
  return true;
};
