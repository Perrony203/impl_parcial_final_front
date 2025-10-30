import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  // Check if user has superadmin role
  const userRole = authService.getUserRole();

  if (userRole === 'superadmin') {
    return true;
  }

  // Show alert and redirect to dashboard if not superadmin
  alert('Access denied. You must be a superadmin to access this page.');
  router.navigate(['/dashboard']);
  return false;
};
