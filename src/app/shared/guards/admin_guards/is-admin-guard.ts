import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, filter, switchMap, take } from 'rxjs';
import { AuthService } from '../../../features/auth/services/auth.service';
import { ToastService } from '../../services/toast/toast.service';


export const isAdminGuard: CanActivateFn = (route, state) => {
  const _authService = inject(AuthService);
  const router = inject(Router);
  const _toast = inject(ToastService);

  return _authService.isUserLoaded.pipe(
    filter((loaded) => {
      return loaded === true;
    }),
    switchMap(() => _authService.admin$),
    take(1),
    map((user) => {
      if (!user || user.role !== 'admin') {
        _toast.warning('Access Denied', 'Please login with an admin account');
        console.log('Unauthorized: redirecting to /adminlogin');

        return router.createUrlTree(['/adminlogin']);
      }
      console.log('Authorized as admin');
      return true;
    })
  );
};
