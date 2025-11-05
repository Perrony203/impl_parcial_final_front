import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Why: Protects routes that only superadmins can access
 * Usage: Add to route definition: canActivate: [roleGuard]
 */
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isSuperAdmin()) {
    return true; // User is superadmin, allow access
  }

  // Why redirect to dashboard: User is logged in but lacks permission
  router.navigate(['/dashboard']);
  return false;
};
