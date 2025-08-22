import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company-service';
import { InternalUserInterface, UpdateInternalUserInterface } from '../../interfaces/company.responce.interface';
import { RoleDisplayPipe } from '../../../../shared/pipes/role-display-pipe';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, switchMap, of } from 'rxjs'; 
import { Passwordvalidator } from '../../../../shared/directives/passwordvalidators/passwordvalidator';
import { CloudinaryService } from '../../../../shared/services/cloudinary.service';
import { SweetAlert } from '../../../../shared/services/sweet-alert';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, RoleDisplayPipe, ReactiveFormsModule, Passwordvalidator],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfile implements OnInit {
  activeCard: 'profile' | 'password' | 'edit' = 'profile';
  userProfile: InternalUserInterface | null = null;
  isLoading = false;
  updateProfileForm!: FormGroup;
  passwordChangeForm!: FormGroup;
  previewImage: string | null = null;
  selectedFile: File | null = null;
  cloudinaryBaseUrl = "https://res.cloudinary.com/dl9iuhkmq/image/upload";

  constructor(
    private fb: FormBuilder,
    private readonly _companyService: CompanyService,
    private readonly _cloudinaryService: CloudinaryService,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _swal: SweetAlert
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.fetchUserProfile();
  }

  initForms(): void {
    this.updateProfileForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^(?!\d+$)(?![^a-zA-Z]+$)[a-zA-Z\s]+$/)]],
      email: ['', [Validators.email, Validators.required]]
    });

    this.passwordChangeForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  private stripCloudinaryBase(url: string): string {
    const parts = url.split('/upload');
    return parts.length > 1 ? parts[1] : url;
  }

  fetchUserProfile(): void {
    this.isLoading = true;
    this._companyService.getUserProfile().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.userProfile = res.data;
          this.populateProfileForm();
          if (this.userProfile.profileImg) {
            this.previewImage = `${this.cloudinaryBaseUrl}${this.userProfile.profileImg}`;
          } else {
            this.previewImage = null;
          }
        }
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error fetching user profile ", err);
        this.isLoading = false;
        this._swal.showErrorToast('Failed to fetch user profile.');
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
      this.previewImage = this.userProfile?.profileImg ? `${this.cloudinaryBaseUrl}${this.userProfile.profileImg}` : null;
      this._cdr.detectChanges();
    }
  }

  setActiveCard(cardType: 'profile' | 'password' | 'edit') {
    this.activeCard = cardType;
    if (cardType === 'edit') {
      this.populateProfileForm();
    }
    const msgElement = document.getElementById('passwordMismatchMsg');
    if (msgElement) msgElement.classList.add('hidden');
  }

  onUpdateProfileSubmit(): void {
    if (this.updateProfileForm.invalid) {
      this.updateProfileForm.markAllAsTouched();
      this._swal.showErrorToast('Please correct the form errors.');
      return;
    }
    this.isLoading = true;
    this._swal.showLoadingToast('Updating profile...');
    const profileData: UpdateInternalUserInterface = {
      name: this.updateProfileForm.get('name')?.value,
      email: this.updateProfileForm.get('email')?.value,
    };
    let uploadObservable: Observable<any>;
    const publicIdBase = this.userProfile?.email ? this.userProfile.email.split('@')[0] : 'user_profile';

    if (this.selectedFile) {
      uploadObservable = this._cloudinaryService.getCloudinarySignature({ folder: 'profile_pics', publicIdPrefix: publicIdBase }).pipe(
        switchMap(signatureRes => {
          if (!signatureRes.success || !signatureRes.data) {
            throw new Error('Failed to get Cloudinary signature');
          }
          return this._cloudinaryService.uploadFileToCloudinary(
            this.selectedFile!,
            signatureRes.data,
            'profile_pics',
            publicIdBase
          );
        })
      );
    } else {
      profileData.profileImg = this.userProfile?.profileImg || undefined;
      uploadObservable = of(null); 
    }
    
    uploadObservable.subscribe({
      next: (cloudinaryUploadResult) => {
        if (cloudinaryUploadResult && cloudinaryUploadResult.secure_url) {
          profileData.profileImg = this.stripCloudinaryBase(cloudinaryUploadResult.secure_url);
        }
        this._companyService.updateUserProfile(profileData).subscribe({
          next: (res) => {
            if (res.success && res.data) {
              this.userProfile = res.data;
              this.previewImage = this.userProfile!.profileImg ? `${this.cloudinaryBaseUrl}${this.userProfile.profileImg}` : null;
              this._swal.showSuccessToast('Profile updated successfully!');
              this.setActiveCard('profile');
            }
            this.isLoading = false;
            this._cdr.detectChanges();
          },
          error: (err) => {
            console.error("Error updating profile in backend:", err);
            this._swal.showErrorToast(err.error?.message || 'Failed to update profile.');
            this.isLoading = false;
            this._cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error("Error during Cloudinary upload or signature:", err);
        this._swal.showErrorToast('Failed to upload profile picture.');
        this.isLoading = false;
        this._cdr.detectChanges();
      }
    });
  }

  updatePassword(): void {
    if (this.passwordChangeForm.invalid) {
      this.passwordChangeForm.markAllAsTouched();
      const confirmPasswordControl = this.passwordChangeForm.get('confirmNewPassword');
      if (confirmPasswordControl && confirmPasswordControl.errors?.['mismatch']) {
        this._swal.showErrorToast('Passwords do not match.');
      }
      return;
    }
    this.isLoading = true;
    this._swal.showLoadingToast('Updating password...');
    const { currentPassword, newPassword } = this.passwordChangeForm.value;
    this._companyService.changePassword(currentPassword, newPassword).subscribe({
      next: (res) => {
        this._swal.showSuccessToast('Password changed successfully.');
        this.isLoading = false;
        this.passwordChangeForm.reset();
        this.setActiveCard('profile');
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error changing password:", err);
        this._swal.showErrorToast(err.error?.message || 'Failed to change password.');
        this.isLoading = false;
        this._cdr.detectChanges();
      }
    });
  }
}