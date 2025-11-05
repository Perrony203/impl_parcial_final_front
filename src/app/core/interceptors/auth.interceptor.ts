import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

/**
 * Why functional interceptor: Angular 20 modern approach, simpler than class-based
 *
 * What it does:
 * 1. Adds JWT token to Authorization header for all requests
 * 2. Catches 401 errors (unauthorized) and logs user out
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Clone request and add auth header if token exists
  // Why clone: HTTP requests are immutable in Angular
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Pass request to next handler and catch 401 errors
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Why: Token expired or invalid, force logout
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
