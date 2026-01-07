import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyApplication } from '../../../services/company-application';
import {
  applicationWithProfile,
  InternalUserInterface,
} from '../../../interfaces/company.responce.interface';
import { CandidateInterface } from '../../../../candidate/interfaces/candidate.interface';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { environment } from '../../../../../../env/environment';
import { TextTransformPipe } from '../../../../../shared/pipes/text-transform-pipe';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Stages } from '../../../../../shared/enums/Interview-stages.enum';
import { SheduleResponceInterface } from '../../../interfaces/company.interviewresponce.interface';
import { SweetAlert } from '../../../../../shared/services/sweet-alert';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-application-details',
  imports: [CommonModule, FormsModule, TextTransformPipe, ReactiveFormsModule],
  templateUrl: './application-details.html',
  styleUrl: './application-details.css',
  animations: [
    trigger('slideFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' })),
      ]),
    ]),
  ],
})
export class ApplicationDetails implements OnInit {
  contentId: string = 'Profile';
  pdfSrc: SafeResourceUrl | null = null;
  applicationId: string | null = null;
  candidateId: string | null = null;
  applicationDetails: applicationWithProfile | null = null;
  profileData: CandidateInterface | null = null;
  addressValue: string | null = null;
  isLoading: boolean = false;
  isLoadingStage: boolean = false;
  isSaving: boolean = false
  saveComplete: boolean = false;
  baseUrl: string = environment.cloudinaryBaseUrl;
  readonly cloudinaryBaseUrl = environment.cloudinaryUrl;
  resumePdfUrl: string | null = null;
  Math = Math;
  currentStageIndex: number = -1;

  currentStageId: string = 'shortlisted';
  interviewScheduled: boolean = true;
  sheduleModal: string | null  = null;
  hrList: InternalUserInterface[] | null = null;
  selectedHr: InternalUserInterface | null = null;
  TelephoneInterview: SheduleResponceInterface | null = null;
  isFeedbackModalOpen: boolean = false;

  interviewSheduleForm!: FormGroup;
  FeedbackForm!: FormGroup;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _ApplicationService: CompanyApplication,
    private readonly _sanitizer: DomSanitizer,
    private readonly _swal: SweetAlert,
    private fb: FormBuilder,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initSeduleFrom();
    this.initFeedbackForm();
    this._route.paramMap.subscribe((parms) => {
      this.applicationId = parms.get('appId');
      this.candidateId = parms.get('canId');
    });

    if (this.applicationId && this.candidateId) {
      this.fetchApplicationDetails();
    }
  }

  initSeduleFrom() {
    this.interviewSheduleForm = this.fb.group({
      scheduledDate: ['', Validators.required],
      scheduledTime: ['', Validators.required],
      hrId: ['', Validators.required],
    });
  }

  SetupReSheduleFrom(){
    if(this.TelephoneInterview){
      this.interviewSheduleForm.patchValue({
        scheduledDate : this.TelephoneInterview.scheduledDate,
        scheduledTime : this.TelephoneInterview.scheduledTime,
        hrId : this.TelephoneInterview.hrName
      })
    }
  }

  initFeedbackForm() {
    this.FeedbackForm = this.fb.group({
      feedback: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  fetchApplicationDetails() {
    this.isLoading = true;
    this._ApplicationService
      .getApplicationDetails(this.applicationId!, this.candidateId!)
      .subscribe({
        next: (value) => {
          this.applicationDetails = value.data;
          this.profileData = value.data.profile;
          const addressObj = this.profileData?.contactInfo?.find(
            (item) => item.type === 'address'
          );
          this.addressValue = addressObj
            ? addressObj.value
            : 'No address available';
          console.log(value);
          this.setResumeUrl();
          this.getStages(value.data.Stages);
          this.isLoading = false;
          this._cdr.detectChanges();
        },
        error: (err) => {
          console.log(
            'error  regading  fetch applicationDetails with profile',
            err
          );
          this._cdr.detectChanges();
        },
      });
  }

  onHrSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const hrId = select.value;
    this.selectedHr = this.hrList?.find((hr) => hr._id === hrId) || null;
  }

  SheduleTeleCaling() {
    if (this.interviewSheduleForm.invalid) {
      this.interviewSheduleForm.markAllAsTouched();
    }
    let data = this.interviewSheduleForm.value;

    data = {
      ...data,
      applicationId: this.applicationId,
      candidateId: this.candidateId,
      stage: this.currentStageId,
      hrName: this.selectedHr?.name,
      userEmail: this.applicationDetails?.email,
    };
    const apiCall =
    this.sheduleModal === 'Scheduled'
      ? this._ApplicationService.sheduleTelephon(data)
      : this._ApplicationService.ReShedule(data);
    apiCall.subscribe({
      next: (res) => {
        if (res.success) {
          if (res.data.stage == 'telephone') {
            this.TelephoneInterview = res.data;
            this.sheduleModalclose();
            this._swal.showSuccessToast(res.message);
            this._cdr.detectChanges();
          }
        }
      },
      error: (err) => {
        console.log('error regading shedule interview ', err);
        this._swal.showErrorToast(err.error.message);
      },
    });
  }

  CancelInterview(){
    this.isSaving = true
    this.saveComplete = false
    const data = {
      applicationId: this.applicationId!,
      stage: this.currentStageId,
      userEmail: this.applicationDetails?.email!
    }

    this._ApplicationService.cancelInterview(data).subscribe({
      next:(res)=>{
        if(res.success){
          this.TelephoneInterview = res.data
          this.isSaving = false
          this.saveComplete = true
          setTimeout(()=> this.saveComplete = false,500)
          this._swal.showSuccessToast(res.message)
          this._cdr.detectChanges()
        }
      },
      error:(err)=>{
        console.log('error regading Cancell interview')
        this._swal.showErrorToast(err.error.message)
        this.isSaving = false 
        this._cdr.detectChanges()
      }
    })
  }

  getStarRating(percentage: number | null | undefined): number {
    if (percentage === null || percentage === undefined) {
      return 0;
    }
    const fivePointScore = percentage / 20;
    return Math.round(fivePointScore * 2) / 2;
  }

  setResumeUrl() {
    const baseUrl = `${this.cloudinaryBaseUrl}/image/upload${this.applicationDetails?.resumeUrl}`;
    this.resumePdfUrl = `${baseUrl}#toolbar=0&navpanes=0&scrollbar=0`;
    this.pdfSrc = this._sanitizer.bypassSecurityTrustResourceUrl(
      this.resumePdfUrl
    );
  }

  switchContent(id: string) {
    this.contentId = id;
  }

  activeContent(id: string): boolean {
    return this.contentId == id;
  }

  switchStages(id: string): void {
    this.currentStageId = id;
    if (id === 'telephone' && !this.TelephoneInterview) {
      this.getStageDetails(id);
    }
  }

  activeStage(id: string): boolean {
    return this.currentStageId == id;
  }

  getStageDetails(id: string) {
    this.isLoadingStage = true;
    this._ApplicationService
      .getStageDetails(this.applicationId!, id)
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res.success) {
            if (res.data.stage == 'telephone') {
              this.TelephoneInterview = res.data;
              this.SetupReSheduleFrom()
              this.isLoadingStage = false;
              this._cdr.detectChanges();
            }
          }
        },
        error: (err) => {
          console.log('error regading fetch stage details', err);
          this.isLoadingStage = false;
          this._cdr.detectChanges();
        },
      });
  }

   sheduleModalOpen(id:string) {
    if (!this.hrList) {
      this._ApplicationService.getHrlist().subscribe({
        next: (res) => {
          this.hrList = res.data;
          this._cdr.detectChanges();
        },
        error: (err) => {
          console.log('error regading  fetch  hr list ', err);
        },
      });
    }
    this.sheduleModal = id;
  }

  sheduleModalclose() {
    this.sheduleModal = null;
  }

  get atsPassed(): boolean {
    return (
      (this.applicationDetails?.atsScore ?? 0) >=
      (this.applicationDetails?.atsCriteria ?? 0)
    );
  }

  openFeedbackModal() {
    if (this.isFeedbackModalOpen) {
      this.isFeedbackModalOpen = false;
    } else {
      this.isFeedbackModalOpen = true;
    }
  }

  updateFeedback() {
    if (this.FeedbackForm.invalid) {
      this.FeedbackForm.markAllAsTouched();
    }
    let data = this.FeedbackForm.value;
    data = {
      ...data,
      stage: this.currentStageId,
      applicationId: this.applicationId,
    };

    this._ApplicationService.updateFeedback(data).subscribe({
      next: (res) => {
        if (res.success) {
          if (res.data.stage === 'telephone') {
            this.TelephoneInterview = res.data;
            this._swal.showSuccessToast(res.message)
            this.openFeedbackModal()
            this._cdr.detectChanges()
          }
        }
      },
      error: (err) => {
        this._swal.showErrorToast(err.error.message)
        this.openFeedbackModal()
        this._cdr.detectChanges()
        console.log('error regading update feedback', err);
      },
    });
  }

  hiringStages = ['Shortlisted', 'Telephonic', 'Technical', 'Hired/Reject'];

  getStages(stage: string ): void {
    switch (stage) {
      case Stages.Shortlisted:
        this.currentStageIndex = 0;
        break;

      case Stages.Telephone:
        this.currentStageIndex = 1;
        break;

      case Stages.Technical:
        this.currentStageIndex = 2;
        break;

      case Stages.Hired:
        this.currentStageIndex = 3;
        break;

      default: 
        this.currentStageIndex = -1;
        break;
    }
  }

  getStageStatus(index: number): 'completed' | 'current' | 'pending' {
    if (this.currentStageIndex === -1) return 'pending';

    if (index < this.currentStageIndex) return 'completed';
    if (index === this.currentStageIndex) return 'current';
    return 'pending';
  }

}
