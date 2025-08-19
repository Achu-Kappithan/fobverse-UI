import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { JobsInterface } from '../../interfaces/company.responce.interface';
import { CompanyService } from '../../services/company-service';
import { SweetAlert } from '../../../../shared/services/sweet-alert';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from '../../../../common/loading-spinner/loading-spinner';

@Component({
  selector: 'app-jobs-public-view',
  imports: [CommonModule,LoadingSpinner,RouterModule],
  templateUrl: './jobs-public-view.html',
  styleUrl: './jobs-public-view.css'
})
export class JobsPublicView  implements OnInit {

  isLoading:boolean = false
  jobDetails:JobsInterface | null = null
  jobId:string | null = null
  responsibility:string[] =[]

  constructor(
    private readonly _companyService:CompanyService,
    private readonly _swal:SweetAlert,
    private readonly _cdr:ChangeDetectorRef,
    private readonly _route:ActivatedRoute,
    private readonly _router:Router
  ){}

  ngOnInit(): void {
    this._route.queryParams.subscribe((val)=>{
      this.jobId = val['id']
      console.log("jobId",this.jobId)
      if(this.jobId){
        this.getJobDetails()
      }
    })
  }

  getJobDetails(){
    this.isLoading = true
    this._companyService.getJobPublicView(this.jobId!)
    .subscribe({
      next:(res =>{
        if(res.success){
          this.jobDetails = res.data
          this.responsibility = res.data.responsibility.split('\n')
          this.isLoading = false
          this._cdr.detectChanges()
        }
      }),
      error: (err =>{
        console.log("error regading job public view",err)
        this._swal.showErrorToast(err.error.message)
        this.isLoading = false
        this._cdr.detectChanges()
      })
    })
  }

  backTo(){
    this._router.navigate(['../'],{relativeTo:this._route})
  }
}
