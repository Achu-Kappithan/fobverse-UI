import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  inject
} from '@angular/core';
import { LoggerService } from '../../../../../../../shared/services/logger/logger.service';
import { ScheduleResponseInterface } from '../../../../../interfaces/company.interview-response.interface';
import { CompanyApplication } from '../../../../../services/company-application';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InternalUserInterface } from '../../../../../interfaces/company.response.interface';
import { ToastService } from '../../../../../../../shared/services/toast/toast.service';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { ConfirmService } from '../../../../../../../shared/services/confirm/confirm.service';

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
  interview: ScheduleResponseInterface | null = null;
  @Input() applicationId: string | null = null;
  @Input() candidateId: string | null = null;
  @Input() userEmail: string | undefined = undefined;

  currentUserId: string | null = null;
  private readonly _logger = inject(LoggerService);

  technicalSheduleModalOpen = false;
  feedbackModalOpen = false;
  finalizeModalOpen = false;
  feedbackCharCount = 0;
  finalizeCharCount = 0;
  sheduleModal: string | null = null;
  isLoading = false;
  isSaving = false;
  saveComplete = false;
  interviewers: InternalUserInterface[] | null = null;
  technicalScheduleForm!: FormGroup;
  feedbackForm!: FormGroup;
  finalizeForm!: FormGroup;

  constructor(
    private readonly _ApplicationService: CompanyApplication,
    private _cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private readonly _toast: ToastService,
    private router: Router,
    private _route: ActivatedRoute,
    private _authService: AuthService,
    private _confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    if (!this.interview && this.applicationId) {
      this.getStageDetails();
    }
    this._authService.company$.subscribe((user) => {
      if (user) {
        this.currentUserId = user.id || user._id || null;
      }
    });
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
              this._logger.log('Interview evaluators fetched');
              this.isLoading = false;
              this._cdr.detectChanges();
          }
        },
        error: (err) => {
          this._logger.error('error regading fetch stage details', err);
          this.isLoading = false;
          this._cdr.detectChanges();
        },
      });
  }

  openTechinalModal(mode = 'Scheduled') {
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

  onFeedbackInput(event: Event) {
    this.feedbackCharCount = (event.target as HTMLTextAreaElement).value.length;
  }

  openFinalizeModal() {
    if (!this.finalizeModalOpen) {
      if (this.interview?.evaluators) {
        for (const evaluator of this.interview.evaluators) {
          if (!evaluator.feedback) {
            this._toast.warning(
              'Feedback Missing: Please wait for all evaluators to submit their feedback.'
            );
            return;
          }
        }
      }
      this.finalizeForm.reset();
    }
    this.finalizeModalOpen = !this.finalizeModalOpen;
  }

  closeFinalizeModal() {
    this.finalizeModalOpen = false;
    this.finalizeForm.reset();
    this.finalizeCharCount = 0;
  }

  onFinalizeInput(event: Event) {
    this.finalizeCharCount = (event.target as HTMLTextAreaElement).value.length;
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
          this._toast.success(res.message);
          setTimeout(() => (this.saveComplete = false), 2000);
          this._cdr.detectChanges();
        }
      },
      error: (err) => {
        this.isSaving = false;
        this._logger.error('error updating feedback', err);
        this._toast.error(err.error?.message || 'Failed to update feedback');
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
      interviewId: this.interview?._id,
      nextStage: 'hired',
      applicationId: this.applicationId,
    };

    this.isSaving = true;
    this._ApplicationService.finalizeTelephoneResult(data).subscribe({
      next: (res) => {
        if (res.success) {
          this.interview = res.data;
          this.isSaving = false;
          this.saveComplete = true;
          this.closeFinalizeModal();
          this._toast.success(res.message);
          setTimeout(() => (this.saveComplete = false), 2000);
          this._cdr.detectChanges();
        }
      },
      error: (err) => {
        this.isSaving = false;
        this._logger.error('error finalizing result', err);
        this._toast.error(err.error?.message || 'Failed to finalize result');
        this._cdr.detectChanges();
      }
    });
  }

  isFeedbackSubmitted(): boolean {
    const currentUserId = this.getCurrentUserId();
    if (!this.interview || !this.interview.evaluators || !currentUserId) {
      return false;
    }
    return this.interview.evaluators.some(
      (evaluator) =>
        (typeof evaluator.interviewerId === 'string' ? evaluator.interviewerId : (evaluator.interviewerId as unknown as Record<string, unknown>)?.['_id']) === currentUserId &&
        !!evaluator.feedback
    );
  }

  SetupReSheduleForm() {
    if (this.interview) {
      const evaluatorIds = this.interview.evaluators
        .filter(e => e.interviewerId)
        .map(e => {
          const id = e.interviewerId;
          return typeof id === 'string' ? id : (id as unknown as Record<string, unknown>)?.['_id'] || '';
        })
        .filter(id => id !== '');

      this._logger.log('Extracted evaluator IDs for reschedule:', evaluatorIds);

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
        this._logger.error('error fetching HR list', err);
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
    const validInterviewerIds = selectedInterviewerIds.filter((id: unknown) => typeof id === 'string' && id.trim() !== '');
    if (validInterviewerIds.length !== selectedInterviewerIds.length) {
      this._logger.warn('Found invalid interviewer IDs (filtered out):',
        selectedInterviewerIds.filter((id: unknown) => typeof id !== 'string' || id.trim() === '')
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
          this._toast.success(res.message);
          this._cdr.detectChanges();
        }
      },
      error: (err) => {
        this._logger.error('error regading shedule interview ', err);
        this._toast.error(err.error.message);
      },
    });
  }

  async triggerCancel() {
    const confirmed = await this._confirmService.confirm({
      title: 'Cancel Interview?',
      message: 'Are you sure you want to cancel this interview?',
      confirmText: 'Yes, cancel',
      cancelText: 'No, keep it',
      type: 'danger',
    });

    if (!confirmed) return;

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
          this._toast.success(res.message);
          this._cdr.detectChanges();
        }
      },
      error: (err) => {
        this._logger.error('error regading cancel interview');
        this._toast.error(err.error.message);
        this.isSaving = false;
        this._cdr.detectChanges();
      },
    });
  }

  onInterviewerChange(event: Event, hrId: string) {
    const selectedIds = this.technicalScheduleForm.get('interviewers')?.value || [];

    if ((event.target as HTMLInputElement).checked) {
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

  canJoinInterview(): boolean {
    if (!this.interview) return false;
    const currentUserId = this.getCurrentUserId();
    this._logger.log('current user id ',currentUserId);
    this._logger.log('scheduled by ',this.interview.scheduledBy);
    this._logger.log('scheduled by matching',this.interview.scheduledBy === currentUserId);
    if (this.interview.scheduledBy === currentUserId) {
      return true;
    }

    const isEvaluator = this.interview.evaluators.some(
      evaluator => {
        const id = evaluator.interviewerId;
        const idString = typeof id === 'string' ? id : (id as unknown as Record<string, unknown>)?.['_id'] || '';
        return idString === currentUserId;
      }
    );

    return isEvaluator;
  }

  onJoinInterview() {
    this._logger.log('Joining interview...');
    if (this.interview?.meetingLink) {
      const roomId = this.interview.meetingLink.split('/').pop();
      if (roomId) {
        this.router.navigate(['video-interview', roomId],{relativeTo: this._route});
      } else {
        this._toast.error('Invalid meeting link');
      }
    } else {
      this._toast.error('No meeting link available');
    }
  }

  private getCurrentUserId(): string {
    return this.currentUserId || '';
  }

}
