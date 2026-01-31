import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ComapnyProfileInterface, JobsInterface } from '../../interfaces/company.responce.interface';
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
  profileData : ComapnyProfileInterface| null = null
  baseUrl :string = environment.cloudinaryBaseUrl

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
        console.log("jobId",this.jobId)
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
          console.log(res.data)
          this.responsibility = res.data.jobDetails.responsibility.split('\n')
          this.isLoading = false
          this._cdr.detectChanges()
        }
      }),
      error: (err =>{
        console.log("error regading job public view",err)
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
