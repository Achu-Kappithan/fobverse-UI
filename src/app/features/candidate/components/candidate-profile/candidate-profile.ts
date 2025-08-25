import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CandidateInterface } from '../../interfaces/candidate.interface';
import { CandidateService } from '../../services/candidate.service';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from '../../../../common/loading-spinner/loading-spinner';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SweetAlert } from '../../../../shared/services/sweet-alert';
import { Observable, switchMap } from 'rxjs';
import { CloudinaryService } from '../../../../shared/services/cloudinary.service';

@Component({
  selector: 'app-candidate-profile',
  imports: [CommonModule, LoadingSpinner, RouterModule],
  templateUrl: './candidate-profile.html',
  styleUrl: './candidate-profile.css',
})
export class CandidateProfile implements OnInit {
  pdfSrc: SafeResourceUrl | null = null;
  selectedFileName: string = 'No file selected';
  selectedFile: File | null = null;

  resumePdfUrl: string | null = null;
  resumeImgUrl: string | null = null;

  profileData: CandidateInterface | null = null;
  isLoading: boolean = false;
  OpenedModal: string | null = null;
  readonly cloudinaryBaseUrl = 'https://res.cloudinary.com/dl9iuhkmq';

  constructor(
    private readonly _candidateService: CandidateService,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _swal: SweetAlert,
    private readonly _sanitizer: DomSanitizer,
    private readonly _cloudinaryService: CloudinaryService
  ) {}

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    this.isLoading = true;
    this._candidateService.GetPorfile().subscribe({
      next: (profile) => {
        if (profile.success) {
          this.profileData = profile.data;
          console.log('Profile data', this.profileData);
          if (this.profileData.resumeUrl) {
            this.setResumeUrls();
          }
          this.isLoading = false;
          this._cdr.detectChanges();
        }
      },
      error: (err) => {
        console.log('error regading candidate profile fetching', err);
        this.isLoading = false;
        this._cdr.detectChanges();
      },
    });
  }

  setResumeUrls() {
  if (this.profileData?.resumeUrl) {
    this.resumePdfUrl = `${this.cloudinaryBaseUrl}/image/upload${this.profileData.resumeUrl}`;
    this.selectedFileName = this.getFileNameFromUrl(this.profileData.resumeUrl);
    this.pdfSrc = this._sanitizer.bypassSecurityTrustResourceUrl(this.resumePdfUrl);
    
  } else {
    this.resumePdfUrl = null;
    this.resumeImgUrl = null;
    this.selectedFileName = 'No file selected';
    this.pdfSrc = null;
  }
  }


  private generateResumeThumbnailUrl(): void {
    if (!this.resumePdfUrl) {
      this.resumeImgUrl = null;
      return;
    }
    const transformations = 'w_400,h_566,c_fill,f_jpg,pg_1';

    const parts = this.resumePdfUrl.split('/upload/');
    if (parts.length > 1) {
      this.resumeImgUrl = `${parts[0]}/upload/${transformations}/${parts[1]}`;
    } else {
      console.warn('Invalid Cloudinary URL for thumbnail generation.');
      this.resumeImgUrl = null;
    }
    this._cdr.detectChanges();
  }

  splitUrls(url: string): string {
    const parts = url.split('/upload');
    return parts.length > 1 ? parts[1] : url;
  }

  updateRsume() {
    if (!this.selectedFile) {
      this._swal.showInfoToast('No new file selected to update.');
      return;
    }

    this.isLoading = true;
    const publicIdPrefix = this.profileData?.name
      ? this.profileData.name.replace(/\s+/g, '_').toLowerCase() + '_resume'
      : 'candidate_resume';

    this._cloudinaryService
      .getCloudinarySignature({
        folder: 'candidate_resumes',
        publicIdPrefix: publicIdPrefix,
      })
      .pipe(
        switchMap((signatureRes) => {
          if (!signatureRes.success || !signatureRes.data) {
            throw new Error('Failed to get Cloudinary signature');
          }
          return this._cloudinaryService.uploadFileToCloudinary(
            this.selectedFile!,
            signatureRes.data,
            'candidate_resumes',
            publicIdPrefix
          );
        })
      )
      .subscribe({
        next: (cloudinaryUploadResult) => {
          if (cloudinaryUploadResult && cloudinaryUploadResult.secure_url) {
            const relativeUrl = this.splitUrls(
              cloudinaryUploadResult.secure_url
            );

            this._candidateService.updateResume(relativeUrl).subscribe({
              next: (res) => {
                if (res.success && res.data) {
                  this.profileData = res.data;
                  this.setResumeUrls();
                  this._swal.showSuccessToast('Resume updated successfully!');
                  this.closeModal();
                }
                this.isLoading = false;
                this._cdr.detectChanges();
              },
              error: (err) => {
                console.error('Error updating resume URL in backend:', err);
                this._swal.showErrorToast(
                  err.error?.message || 'Failed to update resume.'
                );
                this.isLoading = false;
                this._cdr.detectChanges();
              },
            });
          }
        },
        error: (err) => {
          console.error('Error during Cloudinary upload:', err);
          this._swal.showErrorToast('Failed to upload resume file.');
          this.isLoading = false;
          this._cdr.detectChanges();
        },
      });
  }

  private getFileNameFromUrl(url: string): string {
    const segments = url.split('/');
    return segments[segments.length - 1] || 'resume.pdf';
  }

  ToggleModal(id: string): void {
    this.OpenedModal = id;
  }

  isModalOpen(id: string): boolean {
    return this.OpenedModal === id;
  }

  closeModal(): void {
    this.OpenedModal = null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.selectedFileName = file.name;
      this.selectedFile = file;
      const fileURL = URL.createObjectURL(file);
      console.log(fileURL);
      this.pdfSrc = this._sanitizer.bypassSecurityTrustResourceUrl(fileURL);
    }
  }

  downloadResume() {
    if (this.pdfSrc) {
      const link = document.createElement('a');
      link.href = this.pdfSrc.toString();
      link.download = this.selectedFileName;
      link.click();
    }
  }

  removeResume() {
    this.pdfSrc = null;
    this.selectedFileName = 'No file selected';
  }
}
