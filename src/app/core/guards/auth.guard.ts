import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Why: Protects routes from unauthenticated users
 * Usage: Add to route definition: canActivate: [authGuard]
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; // User is logged in, allow access
  }

  // Why store returnUrl: After login, redirect user back to where they wanted to go
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};
