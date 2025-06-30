import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { UserRegisterService } from '../services/auth.service';
import { Router } from '@angular/router';

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(UserRegisterService);
  const router = inject(Router)

  const publicPaths = [
    '/auth/refresh',
    'auth/login',
    'auth/register',
    'auth/google',
    'auth/admin/login',
  ]

  const isPublicRequest = publicPaths.some((path)=> req.url.includes(path))

if(isPublicRequest) {
    return next(req);
}

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
        if (error.status === 401 ) {
           console.log('Interceptor caught 401 - trying to refresh token');
           return handle401Error(req, next, authService, router);
        }
      return throwError(() => error);
    })
  );
};

function handle401Error(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: UserRegisterService,
  router:Router
): Observable<HttpEvent<any>> {
    console.log("interceptor working")
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
        authService.userSubject.next(null);
        router.navigate(['/login']);
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


