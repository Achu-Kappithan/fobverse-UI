import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { UserRegisterService } from '../../../services/auth.service';
import { SweetAlert } from '../../../../../shared/services/sweet-alert';

@Component({
  selector: 'app-candidate-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './candidate-signup.html',
  styleUrl: './candidate-signup.css',
})
export class CandidateSignup implements OnInit {
  private service = inject(UserRegisterService);
  private sweetalert = inject(SweetAlert);
  private router = inject(Router);

  signupForm!: FormGroup;
  userType:string = ""
  imagePath: string = ""

  constructor(private route:ActivatedRoute){
    this.route.data.subscribe((data)=>{
      this.userType = data['userType']
    })
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

    if (
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }else{
      if (confirmPassword.hasError('passwordMismatch')) {
        confirmPassword.setErrors(null);
      }
    }
    return null;
  }

  handleSubmit():void {
    if (this.signupForm.valid) {
      const { fullName, email, password } = this.signupForm.value;
      const userData = {
        fullName: fullName,
        email: email,
        password: password,
        role : this.userType
      }
      console.log("Signup form",userData)
      this.service.registerCandidate(userData).subscribe({
        next: (response) => {
          console.log('registration responce comes from the backend', response);
          this.sweetalert.showSuccessToast(response.message);
          this.signupForm.reset();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.log(error);
          this.sweetalert.showErrorToast(error.error.message);
        },
      });
    } else {
      console.log('Form is Invalid');
      this.signupForm.markAllAsTouched()
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
