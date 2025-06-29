import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserRegisterService } from '../../../services/auth.service';
import { SweetAlert } from '../../../../../shared/services/sweet-alert';
import { GoogleLoginProvider, GoogleSigninButtonModule, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-candidate-login',
  imports: [RouterModule, ReactiveFormsModule, CommonModule,GoogleSigninButtonModule],
  templateUrl: './candidate-login.html',
  styleUrl: './candidate-login.css',
})
export class CandidateLogin implements OnInit, OnDestroy {

  loginForm!: FormGroup;
  user: SocialUser | null = null
  loggedIn: boolean = false;

  userType:string=''
  imagePath:string = ''

  private service = inject(UserRegisterService);
  private router = inject(Router);
  private swal = inject(SweetAlert);
  private googleService = inject(SocialAuthService)
  private route = inject(ActivatedRoute)
  private googlesub?:Subscription

  // constructor(
  //   private googleService:SocialAuthService,
  //   private route:ActivatedRoute
  // ){
      
  //   this.route.data.subscribe((data)=>{
  //     this.userType=data['userType']
  //   })

  //   this.imagePath = this.userType =='candidate' ? "/templateimages/v1_5138.png": "/templateimages/image.png"
  // }

  ngOnInit(): void {
    this.route.data.subscribe((data)=>{
      this.userType = data['userType'] ?? 'candidate'
      this.imagePath = this.userType =='candidate' ? "/templateimages/v1_5138.png": "/templateimages/image.png"


      this.googlesub =this.googleService.authState.subscribe({
        next: (user) => {
          if (user && user.idToken) {
            this.service.googleLogin(user.idToken,this.userType)
              .subscribe({
                next: (response) => {
                  console.log('Backend response:', response);
                  if(response.success){
                    this.swal.showSuccessToast(response.message ?? 'Login Successfull')
                    console.log("logedin user role",response.data?.role)
                    if(response.data?.role === 'candidate'){
                      this.router.navigate(['/candidate/home']);
                    }else if(response.data?.role === 'company'){
                      this.router.navigate(['/company/home'])
                    }
                  }
                },
                error: (error) => {
                  console.error('Error during login:', error);
                  this.swal.showErrorToast(error.error.message)?? "Google login faild"
                },
              });
          }
        },
        error: (error) => {
          console.error('Google auth state error:', error);
        },
      });
    })


    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });

  }

  handleFormSubmit(): void {
    if (this.loginForm.valid) {
      const userdata = {
        ...this.loginForm.value,
        role: this.userType
      }
      console.log('Form submitted successfully!',userdata);
      this.service.candidateLogin(userdata).subscribe({
      next: (response) => {
        if (response.success) {
          this.swal.showSuccessToast(response.message ?? "Login SuccessFull");
          console.log("resoponce login data",response)
          if(response.data?.role === 'candidate'){
            this.router.navigate(['/candidate/home']);
          }else if(response.data?.role === 'company'){
            this.router.navigate(['/company/home'])
          }
        } else {
          this.swal.showErrorToast(response.message ?? "Invalid Email or Password");
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

  ngOnDestroy(): void {
    this.googlesub?.unsubscribe()
  }
}
