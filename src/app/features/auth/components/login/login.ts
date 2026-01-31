import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  GoogleLoginProvider,
  GoogleSigninButtonModule,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { Passwordvalidator } from '../../../../shared/directives/passwordvalidators/passwordvalidator';

@Component({
  selector: 'app-login',
  imports: [
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    GoogleSigninButtonModule,
    Passwordvalidator,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class CandidateLogin implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  user: SocialUser | null = null;
  loggedIn: boolean = false;

  userType: string = '';
  imagePath: string = '';

  private _AuthService = inject(AuthService);
  private _router = inject(Router);
  private _toast = inject(ToastService);
  private _googleService = inject(SocialAuthService);
  private _route = inject(ActivatedRoute);
  private _googlesub?: Subscription;

  ngOnInit(): void {
    this._route.data.subscribe((data) => {
      this.userType = data['userType'] ?? 'candidate';
      this.imagePath =
        this.userType == 'candidate'
          ? '/templateimages/v1_5138.png'
          : '/templateimages/image.png';

      this._googlesub = this._googleService.authState.subscribe({
        next: (user) => {
          if (user && user.idToken) {
            this._AuthService.googleLogin(user.idToken, this.userType).subscribe({
              next: (response) => {
                console.log('Backend response:', response);
                if (response.success) {
                  this._toast.success(
                    response.message ?? 'Login Successfull'
                  );
                  console.log('logedin user role', response.data?.role);
                  if (response.data?.role === 'candidate') {
                    this._router.navigate(['/candidate/home']);
                  } else if (response.data?.role === 'company') {
                    this._router.navigate(['/company/home']);
                  }
                }
              },
              error: (error) => {
                console.error('Error during login:', error);
                this._toast.error(error.error.message);
              },
            });
          }
        },
        error: (error) => {
          console.error('Google auth state error:', error);
        },
      });
    });

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });

    if (this.userType === 'company_admin') {
      this.loginForm.addControl(
        'role',
        new FormControl('company_admin', Validators.required)
      );
    }
  }

  handleFormSubmit(): void {
    if (this.loginForm.valid) {
      const userdata = {
        ...this.loginForm.value,
        role: this.userType,
      };
      console.log('Form submitted successfully!', userdata);

      if (this.userType === 'admin') {
        this._AuthService.adminLogin(userdata).subscribe({
          next: (response) => {
            console.log('adminLogin Resoponse', response);
            if (response.success) {
              this._toast.success(
                response.message ?? 'Login Successfull....'
              );
              this._router.navigate(['/admin/dashboard']);
            }
          },
          error: (error) => {
            this._toast.error(error.error.message);
            this.loginForm.reset();
          },
        });
      } else if (this.userType === 'candidate') {
        this._AuthService.candidateLogin(userdata).subscribe({
          next: (response) => {
            if (response.success) {
              this._toast.success(
                response.message ?? 'Login SuccessFull'
              );
              this._router.navigate(['/candidate/home']);
            } else {
              this._toast.error(
                response.message ?? 'Invalid Email or Password'
              );
              this.loginForm.reset();
            }
          },
          error: (err) => {
            console.error('Login error:', err);
            this._toast.error(err.statusText, err.error.message);
            this.loginForm.reset();
          },
        });
      } else {
        const logindata = this.loginForm.value;
        this._AuthService.companyUsersLogin(logindata).subscribe({
          next: (res) => {
            console.log('companylogin Responce', res);
            if (res.success) {
              this._toast.success(res.message ?? 'Login SuccessFull');
              this._router.navigate(['/company/home']);
              this.loginForm.reset();
            }
          },
          error: (err) => {
            console.log('error regading company login', err);
            this._toast.error(
              err.error.message ?? 'Error regading login  plz try again..!'
            );
          },
        });
      }
    } else {
      console.log('Form is invalid');
      this.loginForm.markAllAsTouched();
    }
  }

  togglePassword(fieldId: string): void {
    const field = document.getElementById(fieldId) as HTMLInputElement;
    const eyeIcon = document.getElementById(`eye-icon-${fieldId}`);

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

  signInWithGoogle(): void {
    this._googleService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  ngOnDestroy(): void {
    this._googlesub?.unsubscribe();
  }
}
