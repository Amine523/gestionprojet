import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Vérifier les rôles si spécifié dans la config de la route
    const expectedRoles = route.data['roles'] as Array<string>;
    if (expectedRoles && !authService.hasRole(expectedRoles)) {
      // Rôle non autorisé
      router.navigate(['/']);
      return false;
    }
    return true;
  }

  // Non connecté
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
