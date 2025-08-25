import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CandidateInterface, ContactInfoItem } from '../../interfaces/candidate.interface';
import { SweetAlert } from '../../../../shared/services/sweet-alert';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { CandidateService } from '../../services/candidate.service';
import { Router, RouterModule } from '@angular/router';
import { CloudinaryService } from '../../../../shared/services/cloudinary.service';

@Component({
  selector: 'app-update-profile',
  imports: [ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './update-profile.html',
  styleUrl: './update-profile.css'
})
export class UpdateProfile implements OnInit {

  isLoading: boolean = false;

  updateProfileForm!: FormGroup;
  profileData: CandidateInterface | null = null; 

  selectedProfileFile: File | null = null;
  ProfilePreviewUrl: string | ArrayBuffer | null = null;

  selectedCover: File | null = null;
  coverPreviewUrl: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private readonly _swal: SweetAlert,
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
        console.error('Error fetching profile data:', err);
        this._swal.showErrorToast('Failed to load profile data.');
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
        this.ProfilePreviewUrl = this.profileData.profileUrl;
        this.updateProfileForm.get('profileUrl')?.setValue(this.profileData.profileUrl);
      } else {
        this.ProfilePreviewUrl = null; 
        this.updateProfileForm.get('profileUrl')?.setValue(null);
      }

      if (this.profileData.coverUrl) {
        this.coverPreviewUrl = this.profileData.coverUrl;
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

  private extractPublicId(url: string): string | null {
    const match = url.match(/v\d+\/(.+)\.\w+$/);
    if (match && match[1]) {
      return match[1];
    }
    console.warn('Could not extract publicId from URL:', url);
    return null;
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
      this._swal.showErrorToast('Please fill all required fields');
      this.updateProfileForm.markAllAsTouched();
      this._cdr.detectChanges(); 
      return;
    }

    const finalProfileData = { ...this.updateProfileForm.value };
    this.isLoading = true;
    this._swal.showLoadingToast('Uploading images and updating profile....');

    try {
      const publicIdBase = this.profileData?.name ? this.profileData.name.toLowerCase().replace(/\s/g, '_') : 'default';

      let profileUpload$: Observable<any>;
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

      let coverUpload$: Observable<any>;
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
          if (profileUploadResult && profileUploadResult.secure_url) {
            finalProfileData.profileUrl = profileUploadResult.secure_url;
          } else {
            finalProfileData.profileUrl = undefined;
          }

          if (coverUploadResult && coverUploadResult.secure_url) {
            finalProfileData.coverUrl = coverUploadResult.secure_url;
          } else {
            finalProfileData.coverUrl = undefined;
          }

          this._candidateService.updateProfile(finalProfileData).subscribe({
            next: (res) => {
              console.log("Profile Updated successfully in the backend", res);
              if (res.success && res.data) {
                this.profileData = res.data;
                this._swal.showSuccessToast('Profile updated successfully!');
                this._router.navigate(['candidate/profile'])
              }
              this.isLoading = false;
              this._swal.closeToast();
              this._cdr.detectChanges();
            },
            error: (err) => {
              console.error('Error updating profile in the backend', err);
              this.isLoading = false;
              this._swal.closeToast();
              this._swal.showErrorToast('Failed to update profile!');
              this._cdr.detectChanges();
            }
          });
        },
        error: (err) => {
          console.error('Error during cloudinary upload or Signature:', err);
          this.isLoading = false;
          this._swal.closeToast();
          this._swal.showErrorToast('Image upload failed!');
          this._cdr.detectChanges();
        }
      });

    } catch (error) {
      console.error("Caught an unexpected error in onSubmit:", error);
      this.isLoading = false;
      this._swal.closeToast();
      this._swal.showErrorToast('An unexpected error occurred!');
      this._cdr.detectChanges();
    }
  }
}
