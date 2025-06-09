import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms'
import { Router, RouterLink } from '@angular/router';
import { UserRegisterService } from '../../../../../core/auth/services/user-register.service';
import { SweetAlert } from '../../../../../core/auth/services/sweet-alert';

@Component({
  selector: 'app-candidate-signup',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './candidate-signup.html',
  styleUrl: './candidate-signup.css'
})
export class CandidateSignup implements OnInit{
  private service = inject(UserRegisterService)
  private sweetalert = inject(SweetAlert)
  private router = inject(Router)

  signupForm! : FormGroup
  ngOnInit(): void {
    this.signupForm = new FormGroup({
      fullName: new FormControl("",Validators.required),
      email: new FormControl("",[Validators.email,Validators.required]),
      password: new FormControl("",[
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
      ]),
      confirmPassword: new FormControl("",Validators.required)
    },{validators:this.passwordMatchValidators})
  }
  passwordMatchValidators(control:AbstractControl ):ValidationErrors | null{
    const password =  control.get('password');
    const confirmPassword = control.get('confirmPassword')
    if(password && confirmPassword && password.value !== confirmPassword.value){
    return {passwordMatch:true}
  }
  return null
  }

  handleSubmit(){
    console.log("submission works")
    if(this.signupForm.valid){
      const {fullName,email,password} = this.signupForm.value
      console.log("Submited form details",this.signupForm.value)
      console.log("Form Submitted",this.signupForm.valid)
      this.service.registerCandidate({fullName,email,password}).subscribe({
        next:(response)=>{
          console.log('registration responce comes from the backend',response)
          this.sweetalert.showSuccessToast('Registration Successful!', 'You can now log in.')
          this.signupForm.reset()
          this.router.navigate(['/login'])
        },
        error:(error)=>{
          console.log(error)
          this.sweetalert.showErrorToast("Error regading registration")
        }
      })

    }else{
      console.log("Form is Invalid")
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
