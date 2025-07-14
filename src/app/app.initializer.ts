import { inject } from '@angular/core';
import { UserRegisterService } from './features/auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export function initializeUser() {
  return () => {
    const authService = inject(UserRegisterService);
    const hasRefresh = document.cookie.includes('refresh_token');
    console.log("refresh:", hasRefresh);

    if (hasRefresh) {
      return firstValueFrom(authService.getCurrentUserDetails());
    } else {
      authService.adminSubject.next(null);
      authService.isUserLoaded.next(true);
      return Promise.resolve();
    }
  };
}
