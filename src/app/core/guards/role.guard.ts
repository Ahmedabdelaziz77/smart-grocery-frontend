import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/auth.model';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['role'] as UserRole;

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/auth']);
  }

  if (authService.role() !== expectedRole) {
    if (authService.role() === 'ADMIN') {
      return router.createUrlTree(['/admin/dashboard']);
    }

    return router.createUrlTree(['/groceries']);
  }

  return true;
};
