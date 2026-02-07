import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, delay, of, Subscription, switchMap, tap } from 'rxjs';
import { UserPartial } from '../../../../shared/interfaces/api-response.interface';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { APP_ROUTES } from '../../../../shared/constants/routes.constants';

@Component({
  selector: 'app-email-verification',
  imports: [CommonModule],
  templateUrl: './email-verification.html',
  styleUrl: './email-verification.css',
})
export class EmailVerification implements OnInit {
  loadingMessage: string = 'Verifying your email. Please wait...';
  private verificationSubscription: Subscription = new Subscription();
  private readonly MIN_LOAD_TIME_MS = 2000;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: AuthService,
    private _toast: ToastService,
    private _logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.verificationSubscription = this._route.queryParams
      .pipe(
        tap((params) =>
          this._logger.log('token get from the params ', params['token'])
        ),
        switchMap((params) => {
          const token = params['token'];
          const startTime = Date.now();
          if (!token) {
            return of({
              success: false,
              message: 'No verification token found.',
              statusCode: 0,
              data: undefined as any,
              reason: 'missing_token',
            }).pipe(
              delay(
                Math.max(0, this.MIN_LOAD_TIME_MS - (Date.now() - startTime))
              )
            );
          } else {
            return this._userService.candidateVerification(token).pipe(
              tap((response) =>
                this._logger.log('Component: Raw API response:', response)
              ),
              catchError((error) => {
                let errorMessage =
                  'An unexpected error occurred during verification.';
                let reason = 'unknown_error';

                if (error.status) {
                  switch (error.status) {
                    case 401:
                      errorMessage = 'Invalid or expired verification token.';
                      reason = 'invalid_or_expired';
                      break;
                    case 404:
                      errorMessage = 'User not found.';
                      reason = 'user_not_found';
                      break;
                    case 409:
                      errorMessage = 'This email is already verified.';
                      reason = 'already_verified';
                      break;
                    case 400:
                      errorMessage = error.error?.message || 'Invalid request.';
                      reason = 'bad_request';
                      break;
                    case 500:
                      errorMessage = 'Server error. Please try again.';
                      reason = 'server_error';
                      break;
                    default:
                      errorMessage = `Verification failed (Status: ${error.status}).`;
                      reason = 'http_error';
                  }
                  if (error.error && typeof error.error.message === 'string') {
                    errorMessage = error.error.message;
                  }
                } else {
                  errorMessage = 'Network error or backend unreachable.';
                  reason = 'network_error';
                }
                return of({
                  success: false,
                  message: errorMessage,
                  statusCode: error.status || 0,
                  data: undefined as any,
                  reason: reason,
                });
              }),
              delay(
                Math.max(0, this.MIN_LOAD_TIME_MS - (Date.now() - startTime))
              )
            );
          }
        })
      )
      .subscribe({
        next: (response) => {
          this._logger.log('Verification result:', response);
          if (response.success) {
            this._toast.success('Email verified successfully!');
            this._router.navigate([`/${APP_ROUTES.EMAIL_SUCCESS}`]);
          } else {
            this._toast.error(response.message!);
            const reasonForRoute = 'api_generic_failure';
            this._router.navigate([`/${APP_ROUTES.EMAIL_FAILED}`], {
              queryParams: { reason: reasonForRoute },
            });
          }
        },
        error: (error) => {
          this._logger.error('Verification subscription error:', error);
        },
      });
  }
  ngOnDestroy(): void {
    if (this.verificationSubscription) {
      this.verificationSubscription.unsubscribe();
    }
  }
}
