import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserRegisterService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert } from '../../../../../shared/services/sweet-alert';

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
  verificationToken:string =""

  private readonly _authService = inject(UserRegisterService)
  private readonly _route = inject(ActivatedRoute)
  private readonly _router = inject(Router)
  private readonly _swal = inject(SweetAlert)

  ngOnInit(): void {

    this._route.queryParams.subscribe((token)=>{
      this.verificationToken = token['token']
    })

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
      const data = {
        password: newPassword,
        token: this.verificationToken
      }
      this._authService.updateNewPassword(data).subscribe({
        next:(response)=>{
          console.log("Updated Password Responce",response)
          if(response.success){
            this._swal.showSuccessToast(response.message)
            this._router.navigate(['/login'])
          }else{
            this._swal.showErrorToast(response.message)
            this.resetForm.reset()
          }
        },
        error:(error)=>{
          console.log("error regading new password updation",error)
          this._swal.showErrorToast(error.error.message)
          this.resetForm.reset()
        }
        
      })
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

