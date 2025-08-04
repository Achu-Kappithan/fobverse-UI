import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { combineLatest, filter, map, switchMap, take } from 'rxjs';

export const authGurdGuard: CanActivateFn = (route, state) => {
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

          if (isLoggedIn) {
            console.log('authGurdGuard: User is logged in. Allowing access.');
            return true;
          } else {
            console.log(
              'authGurdGuard: User is NOT logged in. Redirecting to /login'
            );
            return router.createUrlTree(['/login']);
          }
        })
      );
    })
  );
};
