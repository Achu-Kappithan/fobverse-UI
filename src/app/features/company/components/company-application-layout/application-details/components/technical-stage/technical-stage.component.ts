import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { SheduleResponceInterface } from '../../../../../interfaces/company.interviewresponce.interface';
import { CompanyApplication } from '../../../../../services/company-application';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InternalUserInterface } from '../../../../../interfaces/company.responce.interface';
import { SweetAlert } from '../../../../../../../shared/services/sweet-alert';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-technical-stage',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './technical-stage.component.html',
  styleUrls: ['./technical-stage.component.css'],
  animations: [
    trigger('slideFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate(
          '250ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' })
        ),
      ]),
    ]),
  ],
})
export class TechnicalStageComponent implements OnInit {
  interview: SheduleResponceInterface | null = null;
  @Input() applicationId: string | null = null;
  @Input() candidateId: string | null = null;
  @Input() userEmail: string | undefined = undefined;

  technicalSheduleModalOpen: boolean = false;
  feedbackModalOpen: boolean = false;
  finalizeModalOpen: boolean = false;
  feedbackCharCount: number = 0;
  finalizeCharCount: number = 0;
  sheduleModal: string | null = null;
  isLoading: boolean = false;
  isSaving: boolean = false;
  saveComplete: boolean = false;
  interviewers: InternalUserInterface[] | null = null;
  technicalScheduleForm!: FormGroup;
  feedbackForm!: FormGroup;
  finalizeForm!: FormGroup;

  constructor(
    private readonly _ApplicationService: CompanyApplication,
    private _cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private readonly _swal: SweetAlert
  ) {}

  ngOnInit(): void {
    if (!this.interview && this.applicationId) {
      this.getStageDetails();
    }
    this.initForm();
    this.initFeedbackForm();
    this.initFinalizeForm();
  }

  initForm() {
    this.technicalScheduleForm = this.fb.group({
      scheduledDate: ['', Validators.required],
      scheduledTime: ['', Validators.required],
      interviewers: [[], Validators.required],
    });
  }

  initFeedbackForm() {
    this.feedbackForm = this.fb.group({
      result: ['', Validators.required],
      feedback: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  initFinalizeForm() {
    this.finalizeForm = this.fb.group({
      finalResult: ['', Validators.required],
      finalFeedback: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  getStageDetails() {
    this.isLoading = true;
    this._ApplicationService
      .getStageDetails(this.applicationId!, 'technical_analysis')
      .subscribe({
        next: (res) => {
          if (res.success) {
              this.interview = res.data;
              console.log('Interview data:', this.interview);
              console.log('Evaluators array:', this.interview?.evaluators);
              console.log('Number of evaluators:', this.interview?.evaluators?.length);
              this.isLoading = false;
              this._cdr.detectChanges();
          }
        },
        error: (err) => {
          console.log('error regading fetch stage details', err);
          this.isLoading = false;
          this._cdr.detectChanges();
        },
      });
  }

  openTechinalModal(mode: string = 'Scheduled') {
    this.sheduleModal = mode;
    
    if (!this.technicalSheduleModalOpen && !this.interviewers) {
        this.fetchInterviewers();
    }
    
    if (mode === 'Rescheduled' && this.interview) {
      this.SetupReSheduleForm();
    }
    
    this.technicalSheduleModalOpen = !this.technicalSheduleModalOpen;
  }

  sheduleModalclose() {
    this.technicalSheduleModalOpen = false;
    this.technicalScheduleForm.reset();
    this.sheduleModal = null;
  }

  openFeedbackModal() {
    this.feedbackModalOpen = true;
  }

  closeFeedbackModal() {
    this.feedbackModalOpen = false;
    this.feedbackForm.reset();
    this.feedbackCharCount = 0;
  }

  onFeedbackInput(event: any) {
    this.feedbackCharCount = event.target.value.length;
  }

  openFinalizeModal() {
    this.finalizeModalOpen = true;
  }

  closeFinalizeModal() {
    this.finalizeModalOpen = false;
    this.finalizeForm.reset();
    this.finalizeCharCount = 0;
  }

  onFinalizeInput(event: any) {
    this.finalizeCharCount = event.target.value.length;
  }

  submitFeedback() {
    if (this.feedbackForm.invalid) {
      this.feedbackForm.markAllAsTouched();
      return;
    }

   let data = this.feedbackForm.value;
    data = {
      ...data,
      interviewId:this.interview?._id
    };


    this.isSaving = true;
    this._ApplicationService.updateFeedback(data).subscribe({
      next: (res) => {
        if (res.success) {
          this.interview = res.data;
          this.isSaving = false;
          this.saveComplete = true;
          this.closeFeedbackModal();
          this._swal.showSuccessToast(res.message);
          setTimeout(() => (this.saveComplete = false), 2000);
          this._cdr.detectChanges();
        }
      },
      error: (err) => {
        this.isSaving = false;
        console.log('error updating feedback', err);
        this._swal.showErrorToast(err.error?.message || 'Failed to update feedback');
        this._cdr.detectChanges();
      }
    });
  }

  submitFinalResult() {
    if (this.finalizeForm.invalid) {
      this.finalizeForm.markAllAsTouched();
      return;
    }

    const formData = this.finalizeForm.value;
    const data = {
      ...formData,
      interviewId: this.interview?._id
    };

    this.isSaving = true;
    this._ApplicationService.finalizeTelephoneResult(data).subscribe({
      next: (res) => {
        if (res.success) {
          this.interview = res.data;
          this.isSaving = false;
          this.saveComplete = true;
          this.closeFinalizeModal();
          this._swal.showSuccessToast(res.message);
          setTimeout(() => (this.saveComplete = false), 2000);
          this._cdr.detectChanges();
        }
      },
      error: (err) => {
        this.isSaving = false;
        console.log('error finalizing result', err);
        this._swal.showErrorToast(err.error?.message || 'Failed to finalize result');
        this._cdr.detectChanges();
      }
    });
  }

  SetupReSheduleForm() {
    if (this.interview) {
      const evaluatorIds = this.interview.evaluators
        .filter(e => e.interviewerId)
        .map(e => {
          const id = e.interviewerId;
          return typeof id === 'string' ? id : (id as any)?._id || '';
        })
        .filter(id => id !== ''); 
      
      console.log('Extracted evaluator IDs for reschedule:', evaluatorIds);
      
      this.technicalScheduleForm.patchValue({
        scheduledDate: this.interview.scheduledDate,
        scheduledTime: this.interview.scheduledTime,
        interviewers: evaluatorIds
      });
    }
  }

  fetchInterviewers() {
    this._ApplicationService.getInterviewers().subscribe({
      next: (res) => {
        this.interviewers = res.data;
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.log('error fetching HR list', err);
      },
    });
  }

  submitSchedule() {
    if (this.technicalScheduleForm.invalid) {
      this.technicalScheduleForm.markAllAsTouched();
      return;
    }

    let data = this.technicalScheduleForm.value;
    
    const selectedInterviewerIds = data.interviewers;
    const validInterviewerIds = selectedInterviewerIds.filter((id: any) => typeof id === 'string' && id.trim() !== '');
    if (validInterviewerIds.length !== selectedInterviewerIds.length) {
      console.warn('Found invalid interviewer IDs (filtered out):', 
        selectedInterviewerIds.filter((id: any) => typeof id !== 'string' || id.trim() === '')
      );
    }
    
    const evaluators = validInterviewerIds.map((id: string) => {
      const interviewer = this.interviewers?.find(hr => hr._id === id);
      return {
        interviewerId: id,
        interviewerName: interviewer?.name 
      };
    });

    data = {
      scheduledDate: data.scheduledDate,
      scheduledTime: data.scheduledTime,
      applicationId: this.applicationId,
      stage: 'technical_analysis',
      userEmail: this.userEmail,
      evaluators: evaluators
    };

    const apiCall =
      this.sheduleModal === 'Scheduled'
        ? this._ApplicationService.sheduleInterview(data)
        : this._ApplicationService.ReShedule(data);

    apiCall.subscribe({
      next: (res) => {
        if (res.success) {
          this.interview = res.data;

          this.sheduleModalclose();
          this._swal.showSuccessToast(res.message);
          this._cdr.detectChanges();
        }
      },
      error: (err) => {
        console.log('error regading shedule interview ', err);
        this._swal.showErrorToast(err.error.message);
      },
    });
  }

  triggerCancel() {
    this.isSaving = true;
    this.saveComplete = false;
    const data = {
      applicationId: this.applicationId!,
      stage: 'technical_analysis',
      userEmail: this.userEmail!,
    };

    this._ApplicationService.cancelInterview(data).subscribe({
      next: (res) => {
        if (res.success) {
          this.interview = res.data;

          this.isSaving = false;
          this.saveComplete = true;
          setTimeout(() => (this.saveComplete = false), 500);
          this._swal.showSuccessToast(res.message);
          this._cdr.detectChanges();
        }
      },
      error: (err) => {
        console.log('error regading cancel interview');
        this._swal.showErrorToast(err.error.message);
        this.isSaving = false;
        this._cdr.detectChanges();
      },
    });
  }

  onInterviewerChange(event: any, hrId: string) {
    const selectedIds = this.technicalScheduleForm.get('interviewers')?.value || [];
    
    if (event.target.checked) {
      selectedIds.push(hrId);
    } else {
      const index = selectedIds.indexOf(hrId);
      if (index >= 0) selectedIds.splice(index, 1);
    }
    this.technicalScheduleForm.get('interviewers')?.setValue(selectedIds);
    this.technicalScheduleForm.get('interviewers')?.markAsTouched();
  }

  isInterviewerSelected(hrId: string): boolean {
    const values = this.technicalScheduleForm.get('interviewers')?.value;
    return values ? values.includes(hrId) : false;
  }

  onStartInterview() {
    console.log('Starting interview...');
    if (this.interview?.meetingLink) {
      window.open(this.interview.meetingLink, '_blank');
    } else {
      this._swal.showInfoToast('Starting interview session...');
    }
  }

}
