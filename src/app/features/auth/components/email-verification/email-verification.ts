import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, delay, of, Subscription, switchMap, tap } from 'rxjs';
import {
  ApiResponce,
  UserPartial,
} from '../../../../shared/interfaces/apiresponce.interface';
import { UserRegisterService } from '../../services/auth.service';
import { SweetAlert } from '../../../../shared/services/sweet-alert';

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
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserRegisterService,
    private swal: SweetAlert
  ) {}

  ngOnInit(): void {
    
    this.verificationSubscription = this.route.queryParams
      .pipe(
        tap((parms) =>
          console.log('token get from the parms ', parms['token'])
        ),
        switchMap((parms) => {
          const token = parms['token'];
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
            return this.userService.candidateVarification(token).pipe(
              tap((response) =>
                console.log('Component: Raw API response:', response)
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
      .subscribe(
        (response: ApiResponce<UserPartial> & { reason?: string }) => {
          if (response.success) {
            this.swal.showSuccessToast('Email verified successfully!');
            this.router.navigate(['/email/success']);
          } else {
            this.swal.showErrorToast(response.message!);
            const reasonForRoute = response.reason || 'api_generic_failure';
            this.router.navigate(['/email/failed'], {
              queryParams: { reason: reasonForRoute },
            });
          }
        },
        (err) => {
          console.error('Unexpected error in verification subscription:', err);
          this.swal.showErrorToast(
            'An unexpected error occurred. Please try again.'
          );
          this.router.navigate(['/email/failed'], {
            queryParams: { reason: 'unhandled_error' },
          });
        }
      );
  }
  ngOnDestroy(): void {
    if (this.verificationSubscription) {
      this.verificationSubscription.unsubscribe();
    }
  }
}
