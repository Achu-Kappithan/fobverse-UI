import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { LoggerService } from '../../../../../shared/services/logger/logger.service';
import { APP_ROUTES } from '../../../../../shared/constants/routes.constants';
import { PlainResponse } from '../../../../../shared/interfaces/api-response.interface';



@Component({
  selector: 'app-set-new-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './set-new-password.html',
  styleUrl: './set-new-password.css',
})
export class SetNewPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  verificationToken = '';
  isLoading = false;

  private readonly _authService = inject(AuthService);
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _toast = inject(ToastService);
  private readonly _logger = inject(LoggerService);

  ngOnInit(): void {
    this._route.queryParams.subscribe((token) => {
      this.verificationToken = token['token'];
    });

    this.resetForm = new FormGroup(
      {
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          ),
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  get password() {
    return this.resetForm.get('password')!;
  }

  get confirmPassword() {
    return this.resetForm.get('confirmPassword')!;
  }

  passwordsMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  };

  onSubmit() {
    if (this.resetForm.valid) {
      this.isLoading = true;
      const newPassword = this.resetForm.value.password;
      this._logger.log('New password:', newPassword);
      const data = {
        password: newPassword,
        token: this.verificationToken,
      };
      this._authService.updateNewPassword(data).subscribe({
        next: (response: PlainResponse) => {
          this.isLoading = false;
          this._logger.log('Updated Password Response', response);
          if (response.success) {
            this._toast.success(response.message);
            this._router.navigate([`/${APP_ROUTES.LOGIN}`]);
          } else {
            this._toast.error(response.message);
            this.resetForm.reset();
          }
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this._logger.error('error regading new password updation', error);
          const errorObj = error as { error?: { message?: string } };
          this._toast.error(errorObj?.error?.message || 'An error occurred');
          this.resetForm.reset();
        },
      });
    } else {
      this.resetForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}
