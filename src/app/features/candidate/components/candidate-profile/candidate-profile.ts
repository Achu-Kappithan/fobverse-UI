import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { CandidateInterface } from '../../interfaces/candidate.interface';
import { CandidateService } from '../../services/candidate.service';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../../common/loading-spinner/loading-spinner';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { switchMap } from 'rxjs';
import { CloudinaryService } from '../../../../shared/services/cloudinary.service';
import { environment } from '../../../../../env/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-candidate-profile',
  imports: [CommonModule,LoadingSpinnerComponent,FormsModule, RouterModule],
  templateUrl: './candidate-profile.html',
  styleUrl: './candidate-profile.css',
})
export class CandidateProfileComponent implements OnInit {
  pdfSrc: SafeResourceUrl | null = null;
  selectedFileName = 'No file selected';
  selectedFile: File | null = null;
  readonly cludBaseUrl:string = environment.cloudinaryBaseUrl

  resumePdfUrl: string | null = null;
  resumeImgUrl: string | null = null;

  profileData: CandidateInterface | null = null;
  isLoading = false;
  OpenedModal: string | null = null;
  readonly cloudinaryBaseUrl = environment.cloudinaryUrl;
  private readonly _logger = inject(LoggerService);

  constructor(
    private readonly _candidateService: CandidateService,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _toast: ToastService,
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
          if (this.profileData.resumeUrl) {
            this.setResumeUrls();
          }
          this.isLoading = false;
          this._cdr.detectChanges();
        }
      },
      error: (err) => {
        this._logger.error('error regading candidate profile fetching', err);
        this.isLoading = false;
        this._cdr.detectChanges();
      },
    });
  }

  setResumeUrls() {
    if (this.profileData?.resumeUrl) {
      this.resumePdfUrl = `${this.cloudinaryBaseUrl}/image/upload${this.profileData.resumeUrl}`;
      this.selectedFileName = this.getFileNameFromUrl(
        this.profileData.resumeUrl
      );
      this.pdfSrc = this._sanitizer.bypassSecurityTrustResourceUrl(
        this.resumePdfUrl
      );
    } else {
      this.resumePdfUrl = null;
      this.resumeImgUrl = null;
      this.selectedFileName = 'No file selected';
      this.pdfSrc = null;
    }
  }

  splitUrls(url: string): string {
    const parts = url.split('/upload');
    return parts.length > 1 ? parts[1] : url;
  }

  updateRsume() {
    if (!this.selectedFile) {
      this._toast.info('No new file selected to update.');
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
          if (cloudinaryUploadResult && cloudinaryUploadResult['secure_url']) {
            const relativeUrl = this.splitUrls(
              cloudinaryUploadResult['secure_url'] as string
            );

            this._candidateService.updateResume(relativeUrl).subscribe({
              next: (res) => {
                if (res.success && res.data) {
                  this.profileData = res.data;
                  this.setResumeUrls();
                  this._toast.success('Resume updated successfully!');
                  this.closeModal();
                }
                this.isLoading = false;
                this._cdr.detectChanges();
              },
              error: (err) => {
                this._logger.error('Error updating resume URL in backend:', err);
                this._toast.error(
                  err.error?.message || 'Failed to update resume.'
                );
                this.isLoading = false;
                this._cdr.detectChanges();
              },
            });
          }
        },
        error: (err) => {
          this._logger.error('Error during Cloudinary upload:', err);
          this._toast.error('Failed to upload resume file.');
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
      this._logger.log('Selected file URL:', fileURL);
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
