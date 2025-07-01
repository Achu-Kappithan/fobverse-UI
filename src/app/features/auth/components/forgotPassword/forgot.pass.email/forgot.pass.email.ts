import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserRegisterService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { response } from 'express';
import { SweetAlert } from '../../../../../shared/services/sweet-alert';
import { error } from 'console';

@Component({
  selector: 'app-forgot.pass.email',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot.pass.email.html',
  styleUrl: './forgot.pass.email.css'
})
export class ForgotPassEmail implements OnInit{
  forgotPasswordForm!: FormGroup;
  userType: string =""
  

  private readonly _authService = inject(UserRegisterService)
  private readonly _route = inject(ActivatedRoute)
  private readonly _swal = inject(SweetAlert)
  private readonly _router = inject(Router)


  ngOnInit(): void {

    this._route.queryParams.subscribe((user)=>{
      this.userType = user['user']
    })

    console.log("this is the data get from  qury ",this.userType)

    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  get email() {
    return this.forgotPasswordForm.get('email')!;
  }

  onSubmit(){
    if(this.forgotPasswordForm.valid){
      const email = this.forgotPasswordForm.value.email
      const user = {email:email,role:this.userType}
      this._authService.validateFogotpassEmail(user).subscribe({
        next: (response)=>{
          console.log("Reseponce forgotpassword",response)
          if(response.success){
            this._swal.showSuccessToast(response.message)
            this._router.navigate(['/login'])
          }else{
            this._swal.showErrorToast(response.message)
            this.forgotPasswordForm.reset()
          }
        },
        error:(error)=>{
          console.log("error updatePassword",error)
          this._swal.showErrorToast(error.error.message)
          this.forgotPasswordForm.reset()
        }
      })
    }else{
      this.forgotPasswordForm.markAllAsTouched()
    }
  }
}
