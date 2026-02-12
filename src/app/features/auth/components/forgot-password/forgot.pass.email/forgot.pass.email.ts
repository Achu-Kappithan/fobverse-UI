import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { LoggerService } from '../../../../../shared/services/logger/logger.service';
import { APP_ROUTES } from '../../../../../shared/constants/routes.constants';
import { PlainResponse } from '../../../../../shared/interfaces/api-response.interface';

@Component({
  selector: 'app-forgot.pass.email',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot.pass.email.html',
  styleUrl: './forgot.pass.email.css',
})
export class ForgotPassEmailComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  userType = '';
  isLoading = false;

  private readonly _authService = inject(AuthService);
  private readonly _route = inject(ActivatedRoute);
  private readonly _toast = inject(ToastService);
  private readonly _router = inject(Router);
  private readonly _logger = inject(LoggerService);

  ngOnInit(): void {
    this._route.queryParams.subscribe((user) => {
      this.userType = user['user'];
    });

    this._logger.log('this is the data get from qury ', this.userType);

    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  get email() {
    return this.forgotPasswordForm.get('email')!;
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      const email = this.forgotPasswordForm.value.email;
      const user = { email: email, role: this.userType };
      this._authService.validateForgotPasswordEmail(user).subscribe({
        next: (response: PlainResponse) => {
          this.isLoading = false;
          this._logger.log('Response forgotpassword', response);
          if (response.success) {
            this._toast.success(response.message);
            this._router.navigate([`/${APP_ROUTES.LOGIN}`]);
          } else {
            this._toast.error(response.message);
            this.forgotPasswordForm.reset();
          }
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this._logger.error('error updatePassword', error);
          const errorObj = error as { error?: { message?: string } };
          this._toast.error(errorObj?.error?.message || 'An error occurred');
          this.forgotPasswordForm.reset();
        },
      });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }
}
