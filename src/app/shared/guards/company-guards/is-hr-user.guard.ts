import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, filter, switchMap, take } from 'rxjs';
import { AuthService } from '../../../features/auth/services/auth.service';
import { ToastService } from '../../services/toast/toast.service';

export const isHrUserGuard: CanActivateFn = (route, state) => {
  const _authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  return _authService.isUserLoaded.pipe(
    filter((loaded) => loaded === true),
    switchMap(() => _authService.company$),
    take(1),
    map((user) => {
      if (user && (user.role === 'company_admin' || user.role === 'hr_user')) {
        return true;
      }
      toast.warning('Access Denied', 'Only HR Users or Company Admins can access this section.');
      
      const currentUrl = router.url;
      if (currentUrl && currentUrl !== '/' && currentUrl !== state.url) {
        return false;
      }
      return router.createUrlTree(['/company/home']);
    })
  );
};
