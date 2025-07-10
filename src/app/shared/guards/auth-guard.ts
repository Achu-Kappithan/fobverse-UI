import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRegisterService } from '../../features/auth/services/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const _authService = inject(UserRegisterService);
  const router = inject(Router);

  return _authService.admin$.pipe(
    map((user) => {
      const authorized = !!user && user.is_verified;
      if (!authorized) {
        console.log('Unauthorized to access');
        return router.createUrlTree(['/adminlogin']);
      }

      console.log('Authorized to access');
      return true;
    })
  );
};
