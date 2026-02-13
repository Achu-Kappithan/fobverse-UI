import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LoggerService } from '../../../../../shared/services/logger/logger.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CompanyService } from '../../../services/company-service';
import { JobsInterface } from '../../../interfaces/company.response.interface';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../../../common/loading-spinner/loading-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-job-view',
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './job-view.html',
  styleUrl: './job-view.css'
})
export class JobViewComponent implements OnInit,OnDestroy{

  private _subscription:Subscription = new Subscription()

  isLoading = false
  jobId :string| null = null
  jobDetails:JobsInterface | null = null
  responsibility:string[] = []
  private readonly _logger = inject(LoggerService);

  constructor(
    private readonly _route:ActivatedRoute,
    private readonly _companyService:CompanyService,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _toast: ToastService
  ) {}

  ngOnInit(): void {
    this.isLoading = true

    this._subscription.add(
      this._route.queryParams.subscribe(parms =>{
        this.jobId = parms['id']
      })
    )

    if(this.jobId){
      this._companyService.getJobDetails(this.jobId).subscribe({
        next:(res =>{
          this._logger.log('Fetched job details successfully');
          if(res.success){
            this.jobDetails = res.data
            this.responsibility = res.data.responsibility.split('\n')
            this.isLoading = false
            this._cdr.detectChanges()
          }
        }),
        error:(err =>{
          this._logger.error("Error fetching job details", err)
          this._toast.error(err.error.message)
          this.isLoading = false
          this._cdr.detectChanges()
        })
      })
    }else{
      this._toast.error('Current jobReference is Missing')
      this._logger.warn("jobId is empty")
      this.isLoading= false
      this._cdr.detectChanges()
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe()
  }
}
