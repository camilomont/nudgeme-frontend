import { HttpInterceptorFn } from '@angular/common/http';

// The backend sets the JWT in an HTTP-only cookie.
// This interceptor simply ensures credentials (cookies) are sent with every request.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const withCredentials = req.clone({ withCredentials: true });
  return next(withCredentials);
};
