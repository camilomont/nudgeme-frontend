import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@shared/services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err) => {
      console.error(`[API Error] ${req.method} ${req.url}:`, err);

      if (err.status === 401 && !router.url.includes('/login')) {
        auth.user.set(null);
        router.navigate(['/login']);
        return throwError(() => err);
      }

      const serverMessage = err.error?.message;
      let message = serverMessage || 'Ocurrió un error inesperado';
      if (err.status === 0) {
        message = 'No se pudo conectar con el servidor';
      }

      toast.show(message, 'error');
      return throwError(() => err);
    }),
  );
};
