import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, filter, switchMap, take } from 'rxjs';
import { AuthService } from '../../../features/auth/services/auth.service';
import { ToastService } from '../../services/toast/toast.service';
import { LoggerService } from '../../services/logger/logger.service';


export const isAdminGuard: CanActivateFn = () => {
  const _authService = inject(AuthService);
  const router = inject(Router);
  const _toast = inject(ToastService);
  const _logger = inject(LoggerService);

  return _authService.isUserLoaded.pipe(
    filter((loaded) => {
      return loaded === true;
    }),
    switchMap(() => _authService.admin$),
    take(1),
    map((user) => {
      if (!user || user.role !== 'admin') {
        _toast.warning('Access Denied', 'Please login with an admin account');
        _logger.warn('Unauthorized: redirecting to /adminlogin');

        return router.createUrlTree(['/adminlogin']);
      }
      _logger.log('Authorized as admin');
      return true;
    })
  );
};
