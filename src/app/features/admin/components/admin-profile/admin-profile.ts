import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CloudinaryService } from '../../../../shared/services/cloudinary.service';
import { Observable, switchMap } from 'rxjs';
import { RoleDisplayPipe } from '../../../../shared/pipes/role-display-pipe';
import { Passwordvalidator } from '../../../../shared/directives/passwordvalidators/passwordvalidator';
import { AdminProfileService } from '../../services/admin-profile.service';

@Component({
  selector: 'app-admin-profile',
  imports: [CommonModule,RouterModule,ReactiveFormsModule,RoleDisplayPipe,Passwordvalidator],
  templateUrl: './admin-profile.html',
  styleUrl: './admin-profile.css'
})
export class AdminProfile {
  activeCard: 'profile' | 'password' | 'edit' = 'profile';
  userProfile: any | null = null;
  isLoading = false;
  updateProfileForm!: FormGroup;
  passwordChangeForm!: FormGroup;
  previewImage: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private readonly _adminProfileService: AdminProfileService,
    private readonly _cloudinaryService:CloudinaryService,
    private readonly _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.fetchUserProfile();
  }

  initForms(): void {
    this.updateProfileForm = this.fb.group({
      name: ['',[ Validators.required,Validators.maxLength(20),
        Validators.pattern(/^(?!\d+$)(?![^a-zA-Z]+$)[a-zA-Z\s]+$/)]],
      email: ['', [Validators.email, Validators.required]]
    });

    this.passwordChangeForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  fetchUserProfile(): void {
    this.isLoading = true;
    this._adminProfileService.getUserProfile().subscribe({
      next: (res) => {
        console.log("Response for getUser", res);
        if (res.success && res.data) {
          this.userProfile = res.data;
          this.populateProfileForm();
          if (this.userProfile.profileImg) {
            this.previewImage = this.userProfile.profileImg;
          }
        }
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error fetching user profile ", err);
        this.isLoading = false;
        this._cdr.detectChanges();
      }
    });
  }

  populateProfileForm(): void {
    if (this.userProfile) {
      this.updateProfileForm.patchValue({
        name: this.userProfile.name,
        email: this.userProfile.email,
      });
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmNewPassword = form.get('confirmNewPassword')?.value;

    if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
      form.get('confirmNewPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      form.get('confirmNewPassword')?.setErrors(null);
      return null;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
        this._cdr.detectChanges();
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null;
      this.previewImage = this.userProfile?.profileImg || "";
      this._cdr.detectChanges();
    }
  }

  setActiveCard(cardType: 'profile' | 'password' | 'edit') {
    this.activeCard = cardType;
    const msgElement = document.getElementById('passwordMismatchMsg');
    if (msgElement) msgElement.classList.add('hidden');
  }

  onUpdateProfileSubmit(): void {
    if (this.updateProfileForm.valid) {
      this.isLoading = true;

      const profileData: any= {
        name: this.updateProfileForm.get('name')?.value,
        email: this.updateProfileForm.get('email')?.value,
      };

      let uploadObservable: Observable<any> = new Observable(subscriber => subscriber.next(null)); 
      let publicIdBase = this.userProfile?.email ? this.userProfile.email.split('@')[0] : 'user_profile';

      if (this.selectedFile) {
        uploadObservable = this._cloudinaryService.getCloudinarySignature({ folder: 'profile_pics', publicIdPrefix: publicIdBase }).pipe(
          switchMap(signatureRes => {
            if (signatureRes.success && signatureRes.data) {
              return this._cloudinaryService.uploadFileToCloudinary(
                this.selectedFile!, 
                signatureRes.data,
                'profile_pics',
                publicIdBase
              );
            } else {
              throw new Error('Failed to get Cloudinary signature');
            }
          })
        );
      }

      uploadObservable.subscribe({
        next: (cloudinaryUploadResult) => {

          if (cloudinaryUploadResult && cloudinaryUploadResult.secure_url) {
            profileData.profileImg = cloudinaryUploadResult.secure_url
          }else if(this.userProfile?.profileImg && !this.selectedFile){
            profileData.profileImg = this.userProfile.profileImg
          }else{
            profileData.profileImg = undefined
          }

          this._adminProfileService.updateUserProfile(profileData).subscribe({
            next: (res) => {
              console.log("Profile updated successfully in backend", res);
              if (res.success && res.data) {
                this.userProfile = res.data;
                if (this.userProfile!.profileImg) {
                  this.previewImage = this.userProfile!.profileImg;
                } else {
                  this.previewImage = ''; 
                }
              }
              this.isLoading = false;
              this._cdr.detectChanges();
            },
            error: (err) => {
              console.error("Error updating profile in backend:", err);
              this.isLoading = false;
              this._cdr.detectChanges();
            }
          });
        },
        error: (err) => {
          console.error("Error during Cloudinary upload or signature:", err);
          this.isLoading = false;
          this._cdr.detectChanges();
        }
      });
    } else {
      this.updateProfileForm.markAllAsTouched();
    }
  }

  updatePassword(): void {
    if (this.passwordChangeForm.valid) {
      this.isLoading = true;
      const { currentPassword, newPassword } = this.passwordChangeForm.value;
      this._adminProfileService.changePassword(currentPassword, newPassword).subscribe({
        next: (res) => {
          console.log("Password changed successfully", res);
          this.isLoading = false;
          this.passwordChangeForm.reset();
          this._cdr.detectChanges();
        },
        error: (err) => {
          console.error("Error changing password:", err);
          this.isLoading = false;
          this._cdr.detectChanges();
        }
      });
    } else {
      this.passwordChangeForm.markAllAsTouched();
      const confirmPasswordControl = this.passwordChangeForm.get('confirmNewPassword');
      if (confirmPasswordControl && confirmPasswordControl.errors?.['mismatch']) {
        const msgElement = document.getElementById('passwordMismatchMsg');
        if (msgElement) msgElement.classList.remove('hidden');
      }
    }
  }
}
