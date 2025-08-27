import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  CandidateJobsInterface,
} from '../../interfaces/candidate.joblist.interface';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, of, switchMap } from 'rxjs';
import { UserPartial } from '../../../../shared/interfaces/apiresponce.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { CandidateService } from '../../services/candidate.service';
import { CloudinaryService } from '../../../../shared/services/cloudinary.service';
import { SweetAlert } from '../../../../shared/services/sweet-alert';
import { QualificationOption } from '../../interfaces/candidate.interface';
import { QualificationLevel } from '../../enums/candidate.enum';

@Component({
  selector: 'app-candidate-applyjob',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './candidate-applyjob.html',
  styleUrl: './candidate-applyjob.css',
})
export class CandidateApplyjob implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() uniqueIdentifier: string = '';
  @Input() jobDetails: CandidateJobsInterface | undefined = undefined;

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  currentUser: UserPartial | null = null;
  qualificationOptions: QualificationOption[] = [];

  jobApplayForm!: FormGroup;
  selectedFileName: string = '';
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private readonly _AuthService: AuthService,
    private readonly _candidateService: CandidateService,
    private readonly _cloudinaryService: CloudinaryService,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _swal: SweetAlert
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.populateQualificationOptions()

    this._AuthService.candidate$.subscribe((val) => {
      this.currentUser = val;
    });
  }

  initForm() {
    this.jobApplayForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(/^[a-zA-Z\s]*$/),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      experience: ['', [Validators.required]],
      qualification: ['', [Validators.required]],
      resume: [null, [Validators.required, this.fileValidator()]],
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.jobApplayForm.patchValue({ resume: file });
      this.jobApplayForm.get('resume')?.updateValueAndValidity();
      this.selectedFile = file;
      this.selectedFileName = file.name;
    } else {
      this.selectedFileName = '';
      this.selectedFile = null;
    }
  }

  fileValidator() {
    return (control: FormControl) => {
      const file = control.value;
      if (file) {
        const fileType = file.name.split('.').pop()?.toLowerCase();
        if (fileType !== 'pdf') {
          return { invalidFileType: true };
        }
      }
      return null;
    };
  }

  onClose() {
    this.close.emit();
  }

  splitUrls(url: string): string {
    const parts = url.split('/upload');
    return parts.length > 1 ? parts[1] : url;
  }

  populateQualificationOptions() {
    this.qualificationOptions = [
      { value: QualificationLevel.HIGH_SCHOOL, label: 'High School Diploma' },
      { value: QualificationLevel.ASSOCIATE, label: "Associate's Degree" },
      { value: QualificationLevel.BACHELOR, label: "Bachelor's Degree" },
      { value: QualificationLevel.MASTER, label: "Master's Degree" },
      { value: QualificationLevel.PHD, label: 'PhD' },
    ];
  }

  handleSubmit() {
    console.log(this.jobDetails)
    if (this.jobApplayForm.valid) {
      console.log('Form is valid and ready for submission.');
      const {resume,...data} = this.jobApplayForm.value;
      data.jobId = this.uniqueIdentifier
      let uploadObservable = new Observable<any>();
      const publicBaseId = this.currentUser?.email.split('@')[0]

      if (this.selectedFile) {
        uploadObservable = this._cloudinaryService
          .getCloudinarySignature({
            folder: 'candiate_resume',
            publicIdPrefix: publicBaseId,
          })
          .pipe(
            switchMap((signatureRes) => {
              if (!signatureRes.success || !signatureRes.data) {
                throw new Error('Failed to get Cloudinary signature');
              }
              return this._cloudinaryService.uploadFileToCloudinary(
                this.selectedFile!,
                signatureRes.data,
                'candiate_resume',
                publicBaseId!
              );
            })
          );
      } else {
        data.resumeUrl = '';
        uploadObservable = of(null);
      }

      uploadObservable.subscribe({
        next: (cloudinaryUploadResult) => {
          if (cloudinaryUploadResult && cloudinaryUploadResult.secure_url) {
            data.resumeUrl = this.splitUrls(
              cloudinaryUploadResult.secure_url
            );
          }
          console.log("datafor submition",data)
          this._candidateService.applayJob(this.jobDetails?.companyId?._id!,data).subscribe({
            next: (res) => {
              if (res.success) {
                this._swal.showSuccessToast('Profile updated successfully!');
              }
            },
            error: (err) => {
              console.error('Error updating profile in backend:', err);
              this._swal.showErrorToast(
                err.error?.message || 'Failed to Applay this role.'
              );
            },
          });
        },
        error: (err) => {
          console.error('Error during Cloudinary upload or signature:', err);
          this._swal.showErrorToast('Failed to upload profile picture.');
        },
      });
      this.jobApplayForm.reset();
      this.onClose();
    } else {
      console.log('Form is invalid. Please correct the errors.');
      this.jobApplayForm.markAllAsTouched();
    }
  }
}
