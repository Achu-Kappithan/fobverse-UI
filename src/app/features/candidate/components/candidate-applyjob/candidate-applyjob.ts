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
  AbstractControl,
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
  userData :UserPartial | null = null

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
    this.getUser();
    this.populateForm();
    this.populateQualificationOptions()
    this.setupFormChanges()

    this._AuthService.candidate$.subscribe((val) => {
      this.currentUser = val;
    });
  }

  getUser(){
    this._AuthService.candidate$.subscribe(val=> this.userData = val)
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
      useExistingResume: [false]
    });
  }

  populateForm(){
    this.jobApplayForm.patchValue(this.userData!)
  }

  setupFormChanges() {
    const resumeControl = this.jobApplayForm.get('resume') as FormControl;
    const useExistingResumeControl = this.jobApplayForm.get('useExistingResume') as FormControl;

    useExistingResumeControl.valueChanges.subscribe(useExisting => {
      if (useExisting) {
        resumeControl.clearValidators();
        resumeControl.disable();
        this.selectedFileName = 'Using profile resume';
        this.selectedFile = null;
      } else {
        resumeControl.setValidators([Validators.required, this.fileValidator()]);
        resumeControl.enable();
        this.selectedFileName = '';
      }
      resumeControl.updateValueAndValidity();
      this._cdr.detectChanges(); 
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
    return (control: AbstractControl) => {
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
  if (this.jobApplayForm.valid) {
    console.log('Form is valid and ready for submission.');
    const { resume, useExistingResume, ...data } = this.jobApplayForm.value;
    data.jobId = this.uniqueIdentifier;
    let uploadObservable: Observable<any>; 

    const publicBaseId = this.currentUser?.email.split('@')[0];

    if (useExistingResume) {
      data.resumeUrl = '';
      uploadObservable = of(null); 
    } else if (this.selectedFile) {
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
      console.error('No resume selected and "use existing" not checked.');
      this._swal.showErrorToast('Please upload a resume or select "Use resume from my profile".');
      return;
    }

    uploadObservable.subscribe({
      next: (cloudinaryUploadResult) => {
        if (!useExistingResume && cloudinaryUploadResult && cloudinaryUploadResult.secure_url) {
          data.resumeUrl = this.splitUrls(
            cloudinaryUploadResult.secure_url
          );
        }
        console.log("data for submission", data);
        this._candidateService.applayJob(this.jobDetails?.companyId?._id!, data).subscribe({
          next: (res) => {
            if (res.success) {
              this._swal.showSuccessToast(res.message);
            }
          },
          error: (err) => {
            console.error('Error updating profile in backend:', err);
            this._swal.showErrorToast(
              err.error?.message || 'Failed to apply for this role.'
            );
          },
        });
      },
      error: (err) => {
        console.error('Error during Cloudinary upload or signature:', err);
        this._swal.showErrorToast('Failed to upload resume.');
      },
    });
      this.onClose();
  } else {
    console.log('Form is invalid. Please correct the errors.');
    this.jobApplayForm.markAllAsTouched();
  }
}
}
