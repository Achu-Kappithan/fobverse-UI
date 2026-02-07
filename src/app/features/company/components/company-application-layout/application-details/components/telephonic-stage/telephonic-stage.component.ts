import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject
} from '@angular/core';
import { LoggerService } from '../../../../../../../shared/services/logger/logger.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ScheduleResponseInterface } from '../../../../../interfaces/company.interview-response.interface';
import { InternalUserInterface } from '../../../../../interfaces/company.response.interface';
import { CompanyApplication } from '../../../../../services/company-application';
import { ToastService } from '../../../../../../../shared/services/toast/toast.service';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { ConfirmService } from '../../../../../../../shared/services/confirm/confirm.service';

@Component({
  selector: 'app-telephonic-stage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './telephonic-stage.component.html',
  styleUrls: ['./telephonic-stage.component.css'],
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
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('150ms ease-in', style({ opacity: 0 }))]),
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ transform: 'scale(0.95)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate(
          '150ms ease-in',
          style({ transform: 'scale(0.95)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class TelephonicStageComponent implements OnInit {
  interview: ScheduleResponseInterface | null = null;
  @Input() applicationId: string | null = null;
  @Input() candidateId: string | null = null;
  @Input() userEmail: string | undefined = undefined;

  hrList: InternalUserInterface[] | null = null;
  isSaving: boolean = false;
  saveComplete: boolean = false;
  isLoading: boolean = false;

  interviewSheduleForm!: FormGroup;
  FeedbackForm!: FormGroup;
  finalizeResultForm!: FormGroup;

  sheduleModal: string | null = null;
  isFeedbackModalOpen: boolean = false;
  isFinalizeModalOpen: boolean = false;
  selectedHr: InternalUserInterface | null = null;
  currentUserId: string | null = null;
  private readonly _logger = inject(LoggerService);

  constructor(
    private fb: FormBuilder,
    private readonly _ApplicationService: CompanyApplication,
    private readonly _toast: ToastService,
    private _cdr: ChangeDetectorRef,
    private _authService: AuthService,
    private _confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    this.initSeduleFrom();
    this.initFeedbackForm();
    this.initFinalizeResultForm();
    if (!this.interview && this.applicationId) {
      this.getStageDetails();
    }
    this._authService.company$.subscribe((user) => {
      if (user) {
        this.currentUserId = user.id || user._id || null;
      }
    });
  }

  initSeduleFrom() {
    this.interviewSheduleForm = this.fb.group({
      scheduledDate: ['', Validators.required],
      scheduledTime: ['', Validators.required],
      hrId: ['', Validators.required],
    });
  }

  initFeedbackForm() {
    this.FeedbackForm = this.fb.group({
      feedback: ['', Validators.required],
      result: ['', Validators.required],
    });
  }

  initFinalizeResultForm() {
    this.finalizeResultForm = this.fb.group({
      finalResult: ['', Validators.required],
      finalFeedback: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  getStageDetails() {
    this.isLoading = true;
    this._ApplicationService
      .getStageDetails(this.applicationId!, 'shortlisted')
      .subscribe({
        next: (res) => {
          if (res.success) {
            if (res.data.stage == 'shortlisted') {
              this.interview = res.data;
              this._logger.log('current stage  details ', this.interview);
              this.isLoading = false;
              this._cdr.detectChanges();
            }
          }
        },
        error: (err) => {
          this._logger.error('error regading fetch stage details', err);
          this.isLoading = false;
          this._cdr.detectChanges();
        },
      });
  }

  SetupReSheduleFrom() {
    if (this.interview) {
      this.interviewSheduleForm.patchValue({
        scheduledDate: this.interview.scheduledDate,
        scheduledTime: this.interview.scheduledTime,
     });
    }
  }

  sheduleModalOpen(id: string) {
    if (!this.hrList) {
      this.fetchHrList();
    }
    this.sheduleModal = id;
    if (id === 'Rescheduled') {
      this.SetupReSheduleFrom();
    }
  }

  sheduleModalclose() {
    this.sheduleModal = null;
    this.interviewSheduleForm.reset();
  }

  onHrSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const hrId = select.value;
    this.selectedHr = this.hrList?.find((hr) => hr._id === hrId) || null;
  }

  submitSchedule() {
    if (this.interviewSheduleForm.invalid) {
      this.interviewSheduleForm.markAllAsTouched();
      return;
    }

    let data = this.interviewSheduleForm.value;
    const evaluator = [
      {
        interviewerId: this.selectedHr?._id,
        interviewerName: this.selectedHr?.name,
      },
    ];
    data = {
      scheduledDate: data.scheduledDate,
      scheduledTime: data.scheduledTime,
      applicationId: this.applicationId,
      stage: 'shortlisted',
      evaluators: evaluator,
      userEmail: this.userEmail,
    };

    const apiCall =
      this.sheduleModal === 'Scheduled'
        ? this._ApplicationService.sheduleTelyInterview(data)
        : this._ApplicationService.ReSheduleTelyphone(data);

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
    const revealed = await this._confirmService.confirm({
      title: 'Cancel Interview?',
      message: 'Are you sure you want to cancel this interview?',
      confirmText: 'Yes, cancel',
      cancelText: 'No, keep it',
      type: 'danger',
    });

    if (!revealed) return;

    this.isSaving = true;
    this.saveComplete = false;
    const data = {
      applicationId: this.applicationId!,
      stage: 'shortlisted',
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
        this._logger.error('error regarding Cancell interview');
        this._toast.error(err.error.message);
        this.isSaving = false;
        this._cdr.detectChanges();
      },
    });
  }

  openFeedbackModal() {
    this.isFeedbackModalOpen = !this.isFeedbackModalOpen;
  }

  submitFeedback() {
    if (this.FeedbackForm.invalid) {
      this.FeedbackForm.markAllAsTouched();
      return;
    }

    let data = this.FeedbackForm.value;
    data = {
      ...data,
      interviewId:this.interview?._id
    };

    this._ApplicationService.updateFeedback(data).subscribe({
      next: (res) => {
        if (res.success) {
          this.interview = res.data;
          this._toast.success(res.message);
          this.openFeedbackModal();
          this._cdr.detectChanges();
        }
      },
      error: (err) => {
        this._toast.error(err.error.message);
        this.openFeedbackModal();
        this._cdr.detectChanges();
        this._logger.error('error regading update feedback', err);
      },
    });
  }

  openFinalizeModal() {
    if (!this.isFinalizeModalOpen) {
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
      this.finalizeResultForm.reset();
    }
    this.isFinalizeModalOpen = !this.isFinalizeModalOpen;
  }

  @Output() updateStage = new EventEmitter<void>();

  submitFinalizeResult() {
    if (this.finalizeResultForm.invalid) {
      this.finalizeResultForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.saveComplete = false;

    let data = this.finalizeResultForm.value;
    data = {
      ...data,
      interviewId: this.interview?._id,
      applicationId: this.applicationId,
      nextStage:'technical_analysis'
    };

    this._ApplicationService.finalizeTelephoneResult(data).subscribe({
      next: (res) => {
        if (res.success) {
          this.interview = res.data;
          this.isSaving = false;
          this.saveComplete = true;
          setTimeout(() => (this.saveComplete = false), 2000);
          this._toast.success(res.message);
          this.openFinalizeModal();
          this._cdr.detectChanges();
          
          if (res.data.finalResult === 'Pass') {
            this.updateStage.emit();
          }
        }
      },
      error: (err) => {
        this._toast.error(err.error.message);
        this.isSaving = false;
        this._cdr.detectChanges();
        this._logger.error('error regarding finalize result', err);
      },
    });
  }

  fetchHrList() {
    if (!this.hrList) {
      this._ApplicationService.getHrlist().subscribe({
        next: (res) => {
          this.hrList = res.data;
          this._cdr.detectChanges();
        },
        error: (err) => {
          this._logger.error('error regading  fetch  hr list ', err);
        },
      });
    }
  }

  isFeedbackSubmitted(): boolean {
    if (!this.interview || !this.interview.evaluators || !this.currentUserId) {
      return false;
    }
    return this.interview.evaluators.some(
      (evaluator) =>
        (evaluator.interviewerId === this.currentUserId) &&
        !!evaluator.feedback
    );
  }
}
