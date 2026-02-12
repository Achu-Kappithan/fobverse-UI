import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { combineLatest, filter, map, switchMap, take } from 'rxjs';
import { LoggerService } from '../../services/logger/logger.service';

export const isLogoutGuard: CanActivateFn = () => {
  const _authService = inject(AuthService);
  const router = inject(Router);
  const _logger = inject(LoggerService);

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
          _logger.log('isLoggdIn (after load check):', isLoggedIn);

          if (isLoggedIn) {
            _logger.log(
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
            _logger.log(
              'isLoggedOutOnlyGuard: Not logged in. Allowing access.'
            );
            return true;
          }
        })
      );
    })
  );
};
