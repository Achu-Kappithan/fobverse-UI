import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-set-new-password',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './set-new-password.html',
  styleUrl: './set-new-password.css'
})
export class SetNewPassword implements OnInit {

  resetForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;

  ngOnInit(): void {
    this.resetForm = new FormGroup({
       password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          ),
        ]),
      confirmPassword: new FormControl('', [Validators.required])
    }, { validators: this.passwordsMatchValidator });
  }

  get password() {
    return this.resetForm.get('password')!;
  }

  get confirmPassword() {
    return this.resetForm.get('confirmPassword')!;
  }

  passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.valid) {
      const newPassword = this.resetForm.value.password;
      console.log('New password:', newPassword);
      // Submit logic here
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

