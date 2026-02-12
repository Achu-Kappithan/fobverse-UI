import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { API_PUBLIC_PATHS, PUBLIC_ROUTES, APP_ROUTES } from '../constants/routes.constants';
import { LoggerService } from '../services/logger/logger.service';

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<unknown> = new BehaviorSubject<unknown>(
  null
);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const logger = inject(LoggerService);

  const isPublicRequest = API_PUBLIC_PATHS.some((path) => req.url.includes(path));

  if (isPublicRequest) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        logger.debug('Interceptor caught 401 - trying to refresh token');
        return handle401Error(req, next, authService, router, logger);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router,
  logger: LoggerService
): Observable<HttpEvent<unknown>> {
  logger.debug('Token refresh process initiated');
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response) => {
        isRefreshing = false;
        refreshTokenSubject.next(response);
        return next(req);
      }),
      catchError((error) => {
        isRefreshing = false;
        authService.adminSubject.next(null);
        
        const currentUrl = router.url.split('?')[0]; 
        const isPublicRoute = PUBLIC_ROUTES.some(route => currentUrl.startsWith(route) || currentUrl === '/');

        if (!isPublicRoute) {
          logger.warn('Redirecting to login due to unauthorized protected request', { url: currentUrl });
          router.navigate([`/${APP_ROUTES.LOGIN}`]);
        } else {
          logger.debug('Suppressed redirect to login as user is already on a public route:', currentUrl);
        }
        
        return throwError(() => error);
      }),
      finalize(() => {
        isRefreshing = false;
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap(() => next(req))
    );
  }
}
