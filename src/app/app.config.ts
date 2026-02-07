import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideEnvironmentInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule  } from '@abacritt/angularx-social-login';
import { initializeUser } from './app.initializer';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './shared/interceptors/auth-interceptor';
import { credentialsInterceptor } from './shared/interceptors/credentials-interceptor';
import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './shared/services/error-handler/global-error-handler';
import { environment } from '../env/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(),
    withInterceptors([authInterceptor,credentialsInterceptor])),
    importProvidersFrom(SocialLoginModule),
    provideEnvironmentInitializer(initializeUser()),
    provideAnimations(),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false, 
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId) 
          }
        ],
        onError: (err: any) => console.error('[SocialAuth] Login error:', err)
      } as SocialAuthServiceConfig
    },
  ]
};
