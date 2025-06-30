import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserRegisterService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot.pass.email',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot.pass.email.html',
  styleUrl: './forgot.pass.email.css'
})
export class ForgotPassEmail implements OnInit{
  forgotPasswordForm!: FormGroup;

  private readonly authService = inject(UserRegisterService)

  ngOnInit(): void {
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
      this.authService.validateFogotpassEmail(email)
    }else{
      this.forgotPasswordForm.markAllAsTouched()
    }
  }
}
