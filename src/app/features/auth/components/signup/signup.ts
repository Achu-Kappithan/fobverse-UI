import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { APP_ROUTES } from '../../../../shared/constants/routes.constants';



@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class SignupComponent implements OnInit {
  private readonly _Authservice = inject(AuthService);
  private _toast = inject(ToastService);
  private _router = inject(Router);
  private _logger = inject(LoggerService);
  private _cdr = inject(ChangeDetectorRef);

  signupForm!: FormGroup;
  userType = '';
  imagePath = '';
  isLoading = false;

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data) => {
      this.userType = data['userType'];
    });
  }

  ngOnInit(): void {
    this.signupForm = new FormGroup(
      {
        fullName: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.email, Validators.required]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          ),
        ]),
        confirmPassword: new FormControl('', Validators.required),
      },
      { validators: this.passwordMatchValidators }
    );
    this.signupForm.get('password')?.valueChanges.subscribe(() => {
      this.signupForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }
  passwordMatchValidators(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (confirmPassword.hasError('passwordMismatch')) {
        confirmPassword.setErrors(null);
      }
    }
    return null;
  }

  handleSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this._cdr.detectChanges();
      const { fullName, email, password } = this.signupForm.value;
      const userData = {
        name: fullName,
        email: email,
        password: password,
        role: this.userType,
      };
      this._logger.log('Signup form', userData);
      this._Authservice.registerCandidate(userData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this._cdr.detectChanges();
          this._logger.log('registration response comes from the backend', response);
          this._toast.success(response.message);
          this.signupForm.reset();
          this._router.navigate([`/${APP_ROUTES.LOGIN}`]);
        },
        error: (error) => {
          this.isLoading = false;
          this._cdr.detectChanges();
          this._logger.error('Registration error:', error);
          let errorMessage = 'An unexpected error occurred';
          if (error.error && error.error.message) {
            errorMessage = Array.isArray(error.error.message)
              ? error.error.message[0]
              : error.error.message;
          }
          this._toast.error(errorMessage);
        },
      });
    } else {
      this._logger.warn('Form is Invalid');
      this.signupForm.markAllAsTouched();
    }
  }

  togglePassword(fieldId: string) {
    const field = document.getElementById(fieldId) as HTMLInputElement;
    const eyeIcon = field.nextElementSibling?.querySelector('svg');

    if (field.type === 'password') {
      field.type = 'text';
      if (eyeIcon) {
        eyeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.062V16.5a1.5 1.5 0 00-1.5-1.5H9.75M12 12a3 3 0 100-6 3 3 0 000 6z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.522 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S3.732 16.057 2.458 12z"/>`;
      }
    } else {
      field.type = 'password';
      if (eyeIcon) {
        eyeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.522 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S3.732 16.057 2.458 12z"/>`;
      }
    }
  }
}
