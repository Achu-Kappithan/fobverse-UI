import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserRegisterService } from '../../../services/auth.service';
import { SweetAlert } from '../../../../../shared/services/sweet-alert';
import { GoogleLoginProvider, GoogleSigninButtonModule, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-candidate-login',
  imports: [RouterLink, ReactiveFormsModule, CommonModule,GoogleSigninButtonModule],
  templateUrl: './candidate-login.html',
  styleUrl: './candidate-login.css',
})
export class CandidateLogin implements OnInit {
  loginForm!: FormGroup;

  user: SocialUser | null = null
  loggedIn: boolean = false;

  private service = inject(UserRegisterService);
  private router = inject(Router);
  private swal = inject(SweetAlert);

  constructor(private googleService:SocialAuthService){}


  ngOnInit(): void {
    this.googleService.authState.subscribe({
      next: (user) => {
        if (user && user.idToken) {
          this.service.googleLogin(user.email, user.idToken)
            .pipe(
              catchError((error) => {
                console.error('Google login failed:', error);
                return throwError(() => new Error('Google login failed'));
              })
            )
            .subscribe({
              next: (response) => {
                console.log('Backend response:', response);
                // Handle successful login (e.g., store token, redirect)
              },
              error: (error) => {
                console.error('Error during login:', error);
                // Show user-friendly error message
              },
            });
        }
      },
      error: (error) => {
        console.error('Google auth state error:', error);
        // Handle Google auth error
      },
    });
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  handleFormSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Form submitted successfully!', this.loginForm.value);
      this.service.candidateLogin(this.loginForm.value).subscribe({
      next: (val) => {
        if (val.success) {
          this.swal.showSuccessToast("Login Completed");
          this.router.navigate(['/candidate/home']);
        } else {
          this.swal.showErrorToast("Invalid Email or Password");
          this.loginForm.reset();
        }
      },
      error: (err) => {
        console.error("Login error:", err);
        this.swal.showErrorToast(err.statusText,err.error.message);
        this.loginForm.reset()
      }
    });
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

  signInWithGoogle():void{
    this.googleService.signIn(GoogleLoginProvider.PROVIDER_ID)
  }
}
