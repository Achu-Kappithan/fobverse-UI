import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CompanyService } from '../../../services/company-service';
import { JobsInterface } from '../../../interfaces/company.responce.interface';
import { SweetAlert } from '../../../../../shared/services/sweet-alert';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from '../../../../../common/loading-spinner/loading-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-job-view',
  imports: [RouterModule,CommonModule,LoadingSpinner],
  templateUrl: './job-view.html',
  styleUrl: './job-view.css'
})
export class JobView implements OnInit,OnDestroy{

  private _subscription:Subscription = new Subscription()

  isLoading = false
  jobId :string| null = null
  jobDetails:JobsInterface | null = null
  responsibility:string[] = [] 

  constructor(
    private readonly _route:ActivatedRoute,
    private readonly _companyService:CompanyService,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _swal: SweetAlert
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
          console.log('responce for getJobDetais: ',res)
          if(res.success){
            this.jobDetails = res.data
            this.responsibility = res.data.responsibility.split('\n')
            this.isLoading = false
            this._cdr.detectChanges()
          }
        }),
        error:(err =>{
          console.log("error for getingJobDetails",err)
          this._swal.showErrorToast(err.error.message)
          this.isLoading = false
          this._cdr.detectChanges()
        })
      })
    }else{
      this._swal.showErrorToast('Current jobReference is Missing')
      console.log("jobId is empty")
      this.isLoading= false
      this._cdr.detectChanges()
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe()
  }
}
