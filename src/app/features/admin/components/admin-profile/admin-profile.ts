import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CloudinaryService } from '../../../../shared/services/cloudinary.service';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { RoleDisplayPipe } from '../../../../shared/pipes/role-display-pipe';
import { PasswordValidator } from '../../../../shared/directives/passwordvalidators/passwordvalidator';
import { environment } from '../../../../../env/environment';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule,RoleDisplayPipe,PasswordValidator],
  templateUrl: './admin-profile.html',
  styleUrl: './admin-profile.css'
})
export class AdminProfileComponent implements OnInit {
  activeCard: 'profile' | 'password' | 'edit' = 'profile';
  adminData: Record<string, unknown> | null = null;
  userProfile: Record<string, unknown> | null = null;
  updateProfileForm: FormGroup;
  passwordChangeForm!: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  previewImage: string | null = null;
  isLoading = false;
  cludBaseUrl = environment.cloudinaryBaseUrl;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private _fb: FormBuilder,
    private _cloudinaryService: CloudinaryService,
    private _cdr: ChangeDetectorRef,
    private _logger: LoggerService,
    private _toast: ToastService
  ) {
    this.updateProfileForm = this._fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      profileImage: ['']
    });
  }

  ngOnInit(): void {
    this.initForms();
    const data = localStorage.getItem('user');
    if (data) {
      this.adminData = JSON.parse(data);
      this.userProfile = this.adminData;
      if (this.adminData) {
        this.updateProfileForm.patchValue({
          firstName: this.adminData['firstName'],
          lastName: this.adminData['lastName'],
          email: this.adminData['email'],
          phone: this.adminData['phone'],
          profileImage: this.adminData['profileImage']
        });
        this.imagePreview = this.adminData['profileImage'] as string;
        this.previewImage = this.adminData['profileImage'] as string;
      }
    }
  }

  initForms(): void {
    this.passwordChangeForm = this._fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
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

  setActiveCard(cardType: 'profile' | 'password' | 'edit') {
    this.activeCard = cardType;
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.previewImage = reader.result as string;
        this._cdr.markForCheck();
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onSubmit(): void {
    if (this.updateProfileForm.valid) {
      if (this.selectedFile) {
        this.uploadImageAndSave();
      } else {
        this.saveProfile(this.updateProfileForm.value.profileImage);
      }
    }
  }

  onUpdateProfileSubmit(): void {
    if (this.updateProfileForm.invalid) {
      this.updateProfileForm.markAllAsTouched();
      this._toast.error('Please correct the form errors.');
      return;
    }
    this.isLoading = true;
    
    if (this.selectedFile) {
      this.uploadImageAndSave();
    } else {
      this.saveProfile(this.updateProfileForm.value.profileImage);
    }
  }

  uploadImageAndSave(): void {
    if (this.selectedFile) {
      this._cloudinaryService.uploadImage(this.selectedFile).subscribe({
        next: (res: Record<string, unknown>) => {
          this.saveProfile(res['secure_url'] as string);
        },
        error: (err: unknown) => {
          this._logger.error('Error uploading image', err);
          this.isLoading = false;
          this._toast.error('Failed to upload image');
        }
      });
    }
  }

  saveProfile(imageUrl: string): void {
    const updatedData = { ...this.updateProfileForm.getRawValue(), profileImage: imageUrl };
    this._logger.info('Saving profile', updatedData);
    this.adminData = { ...this.adminData, ...updatedData };
    this.userProfile = this.adminData;
    localStorage.setItem('user', JSON.stringify(this.adminData));
    this.isLoading = false;
    this._toast.success('Profile updated successfully!');
    this.setActiveCard('profile');
  }

  updatePassword(): void {
    if (this.passwordChangeForm.invalid) {
      this.passwordChangeForm.markAllAsTouched();
      const confirmPasswordControl = this.passwordChangeForm.get('confirmNewPassword');
      if (confirmPasswordControl && confirmPasswordControl.errors?.['mismatch']) {
        this._toast.error('Passwords do not match.');
      }
      return;
    }
    this.isLoading = true;
    
    // Simulate password change - implement actual service call
    setTimeout(() => {
      this._toast.success('Password changed successfully.');
      this.isLoading = false;
      this.passwordChangeForm.reset();
      this.setActiveCard('profile');
      this._cdr.detectChanges();
    }, 1000);
  }

  getUserRole(): string {
    return this.userProfile?.['role'] as string;
  }
}
