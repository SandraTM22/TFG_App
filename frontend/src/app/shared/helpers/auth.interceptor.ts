import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  //const token = localStorage.getItem('authToken'); //recogemos token
  const token = inject(AuthService).getToken();//recogemos token

  //excluimos al login ya que no queremos pasarle token
  if (req.url.includes('/api/login')) {
    return next(req);
  }

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  return next(req);
};
