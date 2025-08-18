import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaginationMeta, QueryParmsInterface } from '../../../../shared/interfaces/apiresponce.interface';
import { AdminCompanyService } from '../../services/admin-company-service';
import { SweetAlert } from '../../../../shared/services/sweet-alert';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TableColumn } from '../../../../shared/interfaces/table.interface';
import { TableComponent } from '../../../../common/table-component/table-component';
import { LoadingSpinner } from '../../../../common/loading-spinner/loading-spinner';
import { AllJobsAdminResponce } from '../../interfaces/company.responce.interface';

@Component({
  selector: 'app-admin-joblist',
  imports: [RouterModule,CommonModule,FormsModule,TableComponent,LoadingSpinner],
  templateUrl: './admin-joblist.html',
  styleUrl: './admin-joblist.css'
})
export class AdminJoblist  implements OnInit {

  isLoading:boolean = false
  jobList:AllJobsAdminResponce[]=[]
  serchValue = new Subject<string>()

  constructor(
    private readonly _adminService:AdminCompanyService,
    private readonly _cdr:ChangeDetectorRef,
    private readonly _swal: SweetAlert
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
        console.log("responce for geting all jobs",res)
        if(res.success){
          this.jobList = res.data
          this.paginationMeta = res.meta!
          this.isLoading =false
          this._cdr.detectChanges()
        }
      }),
      error:(err)=>{
        console.log('error for geting Alljobs: ',err)
        this._swal.showErrorToast(err.error.message)
        this.isLoading = false
        this._cdr.detectChanges()
      }
    })
  }

  updateUserAction(event:{action:string,row:any}){
    const {action,row}= event
    if(action ==='Activate'){
      if(row.activeStatus){
        this._swal.showErrorToast("Current User Status is Active")
      }else{
        this.updateJobStatus(row)
      }
    }else if(action ==='deactivate'){
      if(!row.activeStatus){
        this._swal.showErrorToast('Current User Status is Inactive')
      }else{
        this.updateJobStatus(row)
      }
    }
  }

  updateJobStatus(job:any){
    this._adminService.ActivateJobStatus(job._id).subscribe({
      next:(res =>{
        if(res.success){
          job.activeStatus = !job.activeStatus
          this._cdr.detectChanges()
          this._swal.showSuccessToast(res.message)
        }
      }),
      error:(err =>{
        console.log("error regading Activate job Status ",err)
        this._swal.showErrorToast(err.error.message)
      })
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
    this.QueryParms.page = page,
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
