import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { combineLatest, filter, map, switchMap, take } from 'rxjs';

export const isLogoutGuard: CanActivateFn = (route, state) => {
  const _authService = inject(AuthService);
  const router = inject(Router);

  return _authService.isUserLoaded.pipe(
    filter((loaded) => loaded === true),
    take(1),
    switchMap(() => {
      return combineLatest([
        _authService.admin$,
        _authService.company$,
        _authService.candidate$,
      ]).pipe(
        take(1),
        map(([adminUser, companyUser, candidateUser]) => {
          const isLoggedIn = !!adminUser || !!companyUser || !!candidateUser;
          console.log('isLoggdIn (after load check):', isLoggedIn);

          if (isLoggedIn) {
            console.log(
              'isLoggedOutOnlyGuard: User already logged in. Redirecting.'
            );
            if (adminUser) {
              return router.createUrlTree(['/admin/dashboard']);
            } else if (companyUser) {
              return router.createUrlTree(['/company/home']);
            } else if (candidateUser) {
              return router.createUrlTree(['/candidate/home']);
            }
            return router.createUrlTree(['/']);
          } else {
            console.log(
              'isLoggedOutOnlyGuard: Not logged in. Allowing access.'
            );
            return true;
          }
        })
      );
    })
  );
};
