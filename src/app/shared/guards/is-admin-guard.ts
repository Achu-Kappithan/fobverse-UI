import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRegisterService } from '../../features/auth/services/auth.service';
import { map, filter, switchMap, take } from 'rxjs';

export const isAdminGuard: CanActivateFn = (route, state) => {
  const _authService = inject(UserRegisterService);
  const router = inject(Router);

  return _authService.isUserLoaded.pipe(
    filter(loaded => {
      return loaded === true;
    }),
    switchMap(() => _authService.admin$),
    take(1),
    map(user => {

      if (!user || user.role !== 'admin') {
        console.log('Unauthorized: redirecting to /adminlogin');
        return router.createUrlTree(['/adminlogin']);
      }
      console.log('Authorized as admin');
      return true;
    })
  );
};
