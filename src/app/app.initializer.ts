import { inject } from '@angular/core';
import { AuthService } from './features/auth/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { LoggerService } from './shared/services/logger/logger.service';

export function initializeUser() {
  return () => {
    const _logger = inject(LoggerService);
    const authService = inject(AuthService);
    const hasRefresh = document.cookie.includes('refresh_token');
    _logger.log('refresh status:', hasRefresh);

    if (hasRefresh) {
      return firstValueFrom(authService.getCurrentUserDetails());
    } else {
      authService.adminSubject.next(null);
      authService.isUserLoaded.next(true);
      return Promise.resolve();
    }
  };
}
