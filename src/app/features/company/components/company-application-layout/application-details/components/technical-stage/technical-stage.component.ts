import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SheduleResponceInterface } from '../../../../../interfaces/company.interviewresponce.interface';
import { CompanyApplication } from '../../../../../services/company-application';

@Component({
  selector: 'app-technical-stage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './technical-stage.component.html',
  styleUrls: ['./technical-stage.component.css']
})
export class TechnicalStageComponent implements OnInit {
  @Input() interview: SheduleResponceInterface | null = null;
  @Input() applicationId: string | null = null;
  @Input() candidateId: string | null = null;
  
  @Output() onSchedule = new EventEmitter<any>(); 
  
  technicalSheduleModalOpen: boolean = false;
  isLoading: boolean = false;

  constructor(
    private readonly _ApplicationService: CompanyApplication,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.interview && this.applicationId) {
       this.getStageDetails();
    }
  }

  getStageDetails() {
    this.isLoading = true;
    this._ApplicationService
      .getStageDetails(this.applicationId!, 'technical_analysis')
      .subscribe({
        next: (res) => {
          if (res.success) {
            if (res.data.stage == 'technical_analysis') {
              this.interview = res.data;
              // this.interviewChange.emit(this.interview); // Optional if parent doesn't care
              this.isLoading = false;
              this._cdr.detectChanges();
            }
          }
        },
        error: (err) => {
          console.log('error regading fetch stage details', err);
          this.isLoading = false;
          this._cdr.detectChanges();
        },
      });
  }

  openTechinalModal(){
    this.technicalSheduleModalOpen = !this.technicalSheduleModalOpen;
  }
}
