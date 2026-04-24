import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('app_token');

  // Clone and add Authorization header if token exists and is a valid JWT
  const authReq = token && token.split('.').length === 3
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expired or invalid — redirect to login
        localStorage.removeItem('app_token');
        localStorage.removeItem('utilisateur');
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};
