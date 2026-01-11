import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { SheduleResponceInterface } from '../../../../../interfaces/company.interviewresponce.interface';
import { CompanyApplication } from '../../../../../services/company-application';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InternalUserInterface } from '../../../../../interfaces/company.responce.interface';
import { SweetAlert } from '../../../../../../../shared/services/sweet-alert';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-technical-stage',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './technical-stage.component.html',
  styleUrls: ['./technical-stage.component.css'],
})
export class TechnicalStageComponent implements OnInit {
  interview: SheduleResponceInterface | null = null;
  @Input() applicationId: string | null = null;
  @Input() candidateId: string | null = null;
  @Input() userEmail: string | undefined = undefined;

  technicalSheduleModalOpen: boolean = false;
  isLoading: boolean = false;
  hrList: InternalUserInterface[] | null = null;
  technicalScheduleForm!: FormGroup;

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
  }

  initForm() {
    this.technicalScheduleForm = this.fb.group({
      scheduledDate: ['', Validators.required],
      scheduledTime: ['', Validators.required],
      interviewers: [[], Validators.required],
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

  openTechinalModal() {
    if (!this.technicalSheduleModalOpen && !this.hrList) {
        this.fetchHrList();
    }
    this.technicalSheduleModalOpen = !this.technicalSheduleModalOpen;
  }

  fetchHrList() {
    this._ApplicationService.getHrlist().subscribe({
      next: (res) => {
        this.hrList = res.data;
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

    const formValue = this.technicalScheduleForm.value;
    const data = {
      ...formValue,
      applicationId: this.applicationId,
      candidateId: this.candidateId,
      stage: 'technical_analysis',
      userEmail: this.userEmail, 
      hrName: 'Panel Interview' 
    };

    this._ApplicationService.sheduleTelephon(data).subscribe({
      next: (res) => {
        if (res.success) {
          this.interview = res.data;
          this.openTechinalModal();
          this._swal.showSuccessToast(res.message);
          this._cdr.detectChanges();
        }
      },
      error: (err) => {
        console.log('error scheduling technical interview', err);
        this._swal.showErrorToast(err.error?.message || 'Failed to schedule');
      }
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

}
