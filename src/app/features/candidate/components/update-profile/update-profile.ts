import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CandidateInterface, ContactInfoItem } from '../../interfaces/candidate.interface';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { forkJoin, Observable, of, Subject, switchMap } from 'rxjs';
import { CandidateService } from '../../services/candidate.service';
import { Router, RouterModule } from '@angular/router';
import { CloudinaryService } from '../../../../shared/services/cloudinary.service';
import { environment } from '../../../../../env/environment';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { APP_ROUTES } from '../../../../shared/constants/routes.constants';

@Component({
  selector: 'app-update-profile',
  imports: [ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './update-profile.html',
  styleUrl: './update-profile.css'
})
export class UpdateProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isLoading = false;

  updateProfileForm!: FormGroup;
  profileData: CandidateInterface | null = null; 

  selectedProfileFile: File | null = null;
  ProfilePreviewUrl: string | ArrayBuffer | null = null;

  selectedCover: File | null = null;
  coverPreviewUrl: string | ArrayBuffer | null = null;
  cludBaseUrl:string = environment.cloudinaryBaseUrl;
  loadingToastId: number | null = null;

  private readonly _logger = inject(LoggerService);
  constructor(
    private fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private readonly _toast: ToastService,
    private readonly _candidateService: CandidateService,
    private readonly _cloudinaryService: CloudinaryService,
    private readonly _router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.isLoading = true;
    this._candidateService.GetPorfile().subscribe({ 
      next: (resp) => {
        this.profileData = resp.data; 
        this.populateForm();
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: (err) => {
        this._logger.error('Error fetching profile data:', err);
        this._toast.error('Failed to load profile data.');
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      complete: () => {
        if (!this.profileData) {
          this.populateForm(); 
        }
      }
    });
  }

  initForm(): void {
    this.updateProfileForm = this.fb.group({
      name: [null,[ Validators.required,Validators.maxLength(10),Validators.pattern(/^(?!\d+$)(?![^a-zA-Z]+$)[a-zA-Z\s]+$/)]],
      profileUrl: [null],
      aboutme: [null, [Validators.required]], 
      coverUrl: [null],
      contactInfo: this.fb.array<FormGroup>([]),
      education: this.fb.array<FormControl>([]), 
      experience: this.fb.array<FormControl>([]),
      skills: this.fb.array<FormControl>([]),
      portfolioLinks: this.fb.array<FormControl>([])
    });
  }

  populateForm(): void {
    if (this.profileData) {
      this.updateProfileForm.patchValue({
        name: this.profileData.name,
        aboutme: this.profileData.aboutme,
      });

      this.contactInfo.clear();
      this.education.clear();
      this.experience.clear();
      this.skills.clear();
      this.portfolioLinks.clear();

      if (this.profileData.profileUrl) {
        this.ProfilePreviewUrl = this.cludBaseUrl+this.profileData.profileUrl;
        this.updateProfileForm.get('profileUrl')?.setValue(this.profileData.profileUrl);
      } else {
        this.ProfilePreviewUrl = null; 
        this.updateProfileForm.get('profileUrl')?.setValue(null);
      }

      if (this.profileData.coverUrl) {
        this.coverPreviewUrl = this.cludBaseUrl+this.profileData.coverUrl;
        this.updateProfileForm.get('coverUrl')?.setValue(this.profileData.coverUrl);
      } else {
        this.coverPreviewUrl = null;
        this.updateProfileForm.get('coverUrl')?.setValue(null);
      }

      this.profileData.contactInfo?.forEach(info => this.addContactInfo(info));
      this.profileData.education?.forEach(edu => this.addEducation(edu));
      this.profileData.experience?.forEach(exp => this.addExperience(exp));
      this.profileData.skills?.forEach(skil => this.addSkills(skil));
      this.profileData.portfolioLinks?.forEach(link => this.addPortfolioLink(link)); 
    }
    this._cdr.detectChanges(); 
  }

  splitUrls(url: string): string {
    const parts = url.split('/upload');
    return parts.length > 1 ? parts[1] : url;
  }

  onProfileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedProfileFile = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.ProfilePreviewUrl = reader.result;
        this._cdr.detectChanges();
      };
      reader.readAsDataURL(this.selectedProfileFile);
    } else {
      this.removeProfileImage();
    }
  }

  onCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedCover = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.coverPreviewUrl = reader.result;
        this._cdr.detectChanges();
      };
      reader.readAsDataURL(this.selectedCover);
    } else {
      this.removeCoverImage();
    }
  }

  get contactInfo(): FormArray {
    return this.updateProfileForm.get('contactInfo') as FormArray;
  }

  get education(): FormArray {
    return this.updateProfileForm.get('education') as FormArray;
  }

  get experience(): FormArray {
    return this.updateProfileForm.get('experience') as FormArray;
  }

  get skills(): FormArray {
    return this.updateProfileForm.get('skills') as FormArray;
  }

  get portfolioLinks(): FormArray {
    return this.updateProfileForm.get('portfolioLinks') as FormArray;
  }

  addContactInfo(info?: ContactInfoItem): void {
    this.contactInfo.push(this.fb.group({
      type: [info ? info.type : '', Validators.required],
      value: [info ? info.value : '', Validators.required]
    }));
    this._cdr.detectChanges();
  }

  removeContactInfo(index: number): void {
    this.contactInfo.removeAt(index);
    this._cdr.detectChanges();
  }

  addEducation(edu?: string): void { 
    this.education.push(this.fb.control(edu || "", Validators.required));
    this._cdr.detectChanges();
  }

  removeEducation(index: number): void {
    this.education.removeAt(index);
    this._cdr.detectChanges();
  }

  addExperience(exp?: string): void { 
    this.experience.push(this.fb.control(exp || '', Validators.required));
    this._cdr.detectChanges();
  }

  removeExperience(index: number): void {
    this.experience.removeAt(index);
    this._cdr.detectChanges();
  }

  addSkills(skill?: string): void { 
    this.skills.push(this.fb.control(skill || "", Validators.required));
    this._cdr.detectChanges();
  }

  removeSkills(index: number): void {
    this.skills.removeAt(index);
    this._cdr.detectChanges();
  }

  addPortfolioLink(link?: string): void { 
    this.portfolioLinks.push(this.fb.control(link || "", Validators.required));
    this._cdr.detectChanges();
  }

  removePortfolioLink(index: number): void {
    this.portfolioLinks.removeAt(index);
    this._cdr.detectChanges();
  }

  removeProfileImage(): void {
    this.selectedProfileFile = null;
    this.ProfilePreviewUrl = null;
    this.updateProfileForm.get('profileUrl')?.setValue(null);
    const profileInput = document.getElementById('profilePictureInput') as HTMLInputElement; 

    if (profileInput) {
      profileInput.value = ''; 
    }
    this._cdr.detectChanges();
  }

  removeCoverImage(): void {
    this.selectedCover = null;
    this.coverPreviewUrl = null;
    this.updateProfileForm.get('coverUrl')?.setValue(null);
    const coverInput = document.getElementById('coverPhotoInput') as HTMLInputElement; 

    if (coverInput) {
      coverInput.value = ''; 
    }
    this._cdr.detectChanges();
  }


  async onSubmit(): Promise<void> {
    if (this.updateProfileForm.invalid) {
      this._toast.error('Please fill all required fields');
      this.updateProfileForm.markAllAsTouched();
      this._cdr.detectChanges(); 
      return;
    }

    const finalProfileData = { ...this.updateProfileForm.value };
    this.isLoading = true;
    this.loadingToastId = this._toast.loading('Uploading images and updating profile....');

    try {
      const publicIdBase = this.profileData?.name ? this.profileData.name.toLowerCase().replace(/\s/g, '_') : 'default';

      let profileUpload$: Observable<Record<string, unknown> | null>;
      if (this.selectedProfileFile) {
        profileUpload$ = this._cloudinaryService.getCloudinarySignature({
          folder: 'candidate_profile',
          publicIdPrefix: publicIdBase
        }).pipe(
          switchMap(signatureResp => {
            if (signatureResp.success && signatureResp.data) {
              return this._cloudinaryService.uploadFileToCloudinary(
                this.selectedProfileFile!,
                signatureResp.data,
                'candidate_profile',
                publicIdBase
              );
            } else {
              throw new Error("Failed to get cloudinary signature for profile");
            }
          })
        );
      } else if (this.profileData?.profileUrl && !this.selectedProfileFile) {
        profileUpload$ = of({ secure_url: this.profileData.profileUrl });
      } else {
        profileUpload$ = of({ secure_url: undefined });
      }

      let coverUpload$: Observable<Record<string, unknown> | null>;
      if (this.selectedCover) {
        coverUpload$ = this._cloudinaryService.getCloudinarySignature({
          folder: 'candidate_cover', 
          publicIdPrefix: publicIdBase
        }).pipe(
          switchMap(signatureResp => {
            if (signatureResp.success && signatureResp.data) {
              return this._cloudinaryService.uploadFileToCloudinary(
                this.selectedCover!,
                signatureResp.data,
                'candidate_cover',
                publicIdBase
              );
            } else {
              throw new Error("Failed to get cloudinary signature for cover");
            }
          })
        );
      } else if (this.profileData?.coverUrl && !this.selectedCover) {
        coverUpload$ = of({ secure_url: this.profileData.coverUrl });
      } else {
        coverUpload$ = of({ secure_url: undefined });
      }

      forkJoin([profileUpload$, coverUpload$]).subscribe({
        next: ([profileUploadResult, coverUploadResult]) => {
          if (profileUploadResult && (profileUploadResult as Record<string, unknown>)['secure_url']) {
            finalProfileData.profileUrl = this.splitUrls((profileUploadResult as Record<string, unknown>)['secure_url'] as string);
          } else {
            finalProfileData.profileUrl = undefined;
          }

          if (coverUploadResult && (coverUploadResult as Record<string, unknown>)['secure_url']) {
            finalProfileData.coverUrl = this.splitUrls((coverUploadResult as Record<string, unknown>)['secure_url'] as string);
          } else {
            finalProfileData.coverUrl = undefined;
          }

          this._candidateService.updateProfile(finalProfileData).subscribe({
            next: (res) => {
              this._logger.info("Profile Updated successfully in the backend", res);
              if (res.success && res.data) {
                this.profileData = res.data;
                if (this.loadingToastId !== null) this._toast.remove(this.loadingToastId);
                this._toast.success('Profile updated successfully!');
                this._router.navigate([`/${APP_ROUTES.CANDIDATE_PROFILE}`])
              }
              this.isLoading = false;
              this._cdr.detectChanges();
            },
            error: (err) => {
              this._logger.error('Error updating profile in the backend', err);
              this.isLoading = false;
              if (this.loadingToastId !== null) this._toast.remove(this.loadingToastId);
              this._toast.error('Failed to update profile!');
              this._cdr.detectChanges();
            }
          });
        },
        error: (err) => {
          this._logger.error('Error during cloudinary upload or Signature:', err);
          this.isLoading = false;
          if (this.loadingToastId !== null) this._toast.remove(this.loadingToastId);
          this._toast.error('Image upload failed!');
          this._cdr.detectChanges();
        }
      });

    } catch (error) {
      this._logger.error("Caught an unexpected error in onSubmit:", error);
      this.isLoading = false;
      if (this.loadingToastId !== null) this._toast.remove(this.loadingToastId);
      this._toast.error('An unexpected error occurred!');
      this._cdr.detectChanges();
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
