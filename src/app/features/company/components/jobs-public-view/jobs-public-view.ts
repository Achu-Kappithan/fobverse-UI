import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { CompanyProfileInterface, JobsInterface } from '../../interfaces/company.response.interface';
import { CompanyService } from '../../services/company-service';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from '../../../../common/loading-spinner/loading-spinner';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../env/environment';

@Component({
  selector: 'app-jobs-public-view',
  imports: [CommonModule,LoadingSpinner,RouterModule],
  templateUrl: './jobs-public-view.html',
  styleUrl: './jobs-public-view.css'
})
export class JobsPublicView  implements OnInit,OnDestroy {

  private _subscription: Subscription = new Subscription()

  isLoading:boolean = false
  jobDetails:JobsInterface | null = null
  jobId:string | null = null
  responsibility:string[] =[]
  profileData : CompanyProfileInterface| null = null
  baseUrl :string = environment.cloudinaryBaseUrl
  private readonly _logger = inject(LoggerService);

  constructor(
    private readonly _companyService:CompanyService,
    private readonly _toast:ToastService,
    private readonly _cdr:ChangeDetectorRef,
    private readonly _route:ActivatedRoute,
    private readonly _router:Router
  ){}

  ngOnInit(): void {
    this._subscription.add(
      this._route.queryParams.subscribe((val)=>{
        this.jobId = val['id']
        this._logger.log("jobId",this.jobId)
        if(this.jobId){
          this.getJobDetails()
        }
      })
    )
  }

  getJobDetails(){
    this.isLoading = true
    this._companyService.getJobPublicView(this.jobId!)
    .subscribe({
      next:(res =>{
        if(res.success){
          this.jobDetails = res.data.jobDetails
          this.profileData = res.data.profile[0]
          this._logger.log("Job details fetched");
          this.responsibility = res.data.jobDetails.responsibility.split('\n')
          this.isLoading = false
          this._cdr.detectChanges()
        }
      }),
      error: (err =>{
        this._logger.error("error regarding job public view",err)
        this._toast.error(err.error.message)
        this.isLoading = false
        this._cdr.detectChanges()
      })
    })
  }

  backTo(){
    this._router.navigate(['../'],{relativeTo:this._route})
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe()
  }
}
