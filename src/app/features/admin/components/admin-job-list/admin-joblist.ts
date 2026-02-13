import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { APP_ROUTES } from '../../../../shared/constants/routes.constants';
import { Router, RouterModule } from '@angular/router';
import { PaginationMeta, QueryParmsInterface } from '../../../../shared/interfaces/api-response.interface';
import { AdminCompanyService } from '../../services/admin-company-service';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TableColumn } from '../../../../shared/interfaces/table.interface';
import { TableComponent } from '../../../../common/table-component/table-component';
import { LoadingSpinnerComponent } from '../../../../common/loading-spinner/loading-spinner';
import { AllJobsAdminResponse } from '../../interfaces/company.response.interface';

@Component({
  selector: 'app-admin-joblist',
  imports: [CommonModule,LoadingSpinnerComponent,FormsModule,RouterModule, TableComponent],
  templateUrl: './admin-joblist.html',
  styleUrl: './admin-joblist.css'
})
export class AdminJoblistComponent  implements OnInit {

  isLoading = false
  jobList:AllJobsAdminResponse[]=[]
  serchValue = new Subject<string>()

  constructor(
    private readonly _adminService:AdminCompanyService,
    private readonly _cdr:ChangeDetectorRef,
    private readonly _toast: ToastService,
    private readonly _router:Router,
    private readonly _logger:LoggerService
  ) {}

  paginationMeta:PaginationMeta = {
    currentPage: 1,
    totalPages: 0,
    totalItems:0,
    itemsPerPage:6
  }

  QueryParms:QueryParmsInterface = {
    page:1,
    limit:6,
    search:''
  }

  public tablecolumns: TableColumn[]=[
    {header:'Role',field:'title',type:'text'},
    {header:'Company',field:'companyId',type:'text'},
    {header:'status',field:'activeStatus',type:'status'},
    {header:'PostDate',field:'createdAt',type:'date'},
    {header:'jobType',field:'jobType',type:'jobType'},
    {header:'vacancies',field:'vacancies',type:'number'},
    {header:'Action', field:'_id',type:'dropdown',
      options:[
        { label: 'View Details', action: 'view' },
        { label: 'Activate', action: 'Activate' },
        { label: 'Deactivate', action: 'deactivate' },
      ]
    }
  ]

  ngOnInit(): void {
    this.fetchAllJobs()

    this.serchValue.pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
    .subscribe(val =>{
      this.QueryParms.search = val
      this.QueryParms.page = 1
      this.fetchAllJobs()
    })
  }

  fetchAllJobs(){
    this.isLoading= true
    this._adminService.getAlljobs(this.QueryParms).subscribe({
      next:(res =>{
        this._logger.log("all jobs response fetched");
        if(res.success){
          this.jobList = res.data
          this.paginationMeta = res.meta!
          this.isLoading =false
          this._cdr.detectChanges()
        }
      }),
      error:(err: unknown)=>{
        this._logger.error('error for getting Alljobs: ',err);
        const errorObj = err as { error?: { message?: string } };
        this._toast.error(errorObj?.error?.message || 'Failed to fetch jobs');
        this.isLoading = false;
        this._cdr.detectChanges();
      }
    })
  }

  updateUserAction(event:{action:string,row:unknown}){
    const {action,row}= event
    const jobRow = row as AllJobsAdminResponse;
    if(action ==='Activate'){
      if(jobRow.activeStatus){
        this._toast.error("Current User Status is Active")
      }else{
        this.updateJobStatus(jobRow)
      }
    }else if(action ==='deactivate'){
      if(!jobRow.activeStatus){
        this._toast.error('Current User Status is Inactive')
      }else{
        this.updateJobStatus(jobRow)
      }
    }else if(action ==='view'){
      this._router.navigate([APP_ROUTES.ADMIN_VIEW_JOB],{queryParams:{id:jobRow._id}})
    }
  }

  updateJobStatus(job:AllJobsAdminResponse){
    this._adminService.ActivateJobStatus(job._id).subscribe({
      next:(res =>{
        if(res.success){
          job.activeStatus = !job.activeStatus
          this._cdr.detectChanges()
          this._toast.success(res.message)
        }
      }),
      error:(err: unknown) => {
        this._logger.error("error regarding Activate job Status ",err);
        const errorObj = err as { error?: { message?: string } };
        this._toast.error(errorObj?.error?.message || 'Status update failed');
      }
    })
  }

  onSerchInput(event:Event){
    const term = (event.target as HTMLInputElement).value
    this.serchValue.next(term)
  }

  onLimitChange(limit:number){
    this.QueryParms.limit = limit
    this.QueryParms.page = 1
    this.fetchAllJobs()
  }

  onPageChange(page:number){
    this.QueryParms.page = page;
    this.fetchAllJobs()
  }

  get Pagenumbers():number[]{
    const pageNumber:number[]= []
    for(let i=1; i<=this.paginationMeta.totalPages;i++){
      pageNumber.push(i)
    }
    return pageNumber
  }

}
