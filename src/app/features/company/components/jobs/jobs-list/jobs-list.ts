import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableColumn } from '../../../../../shared/interfaces/table.interface';
import { TableComponent } from '../../../../../common/table-component/table-component';
import { Router, RouterModule } from '@angular/router';
import { PaginationMeta, QueryParmsInterface } from '../../../../../shared/interfaces/apiresponce.interface';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CompanyService } from '../../../services/company-service';
import { JobsInterface } from '../../../interfaces/company.responce.interface';
import { SweetAlert } from '../../../../../shared/services/sweet-alert';
import { LoadingSpinner } from "../../../../../common/loading-spinner/loading-spinner";

@Component({
  selector: 'app-jobs-list',
  imports: [CommonModule, FormsModule, TableComponent, RouterModule, LoadingSpinner],
  templateUrl: './jobs-list.html',
  styleUrl: './jobs-list.css',
})
export class JobsList implements OnInit {

  isLoading:boolean = false
  serchValue = new Subject<string>()
  jobs: JobsInterface[] = []

  constructor(
    private readonly _router: Router,
    private readonly _companyService:CompanyService,
    private readonly _cdr :ChangeDetectorRef,
    private readonly _swal : SweetAlert
  ) {}

  public tablecolumns: TableColumn[] = [
    { header: 'Role', field: 'title', type: 'text' },
    { header: 'status', field: 'activeStatus', type: 'status' },
    { header: 'Postdate', field: 'createdAt', type: 'date' },
    { header: 'dueDate', field: 'dueDate', type: 'date' },
    { header: 'jobType', field: 'jobType', type: 'jobType' },
    { header: 'vacancies', field: 'vacancies', type: 'number' },
    { header: 'Action', field: '_id', type: 'dropdown',
      options:[
        { label: 'View Details', action: 'viewDetails' },
        { label: 'View Applications', action: 'viewApplications' }
      ]
     },
  ];

  ngOnInit(): void {
    this.fetchAllJobs()

    this.serchValue.pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
    .subscribe((term)=>{
      this.QueryParms.search = term
      this.QueryParms.page = 1
      this.fetchAllJobs()
    })
  }

  QueryParms : QueryParmsInterface = {
    page:1,
    limit:6,
    search:''
  }

  paginationMeta: PaginationMeta ={
    totalItems: 0,
    currentPage:1,
    itemsPerPage: 6,
    totalPages:0
  }

  fetchAllJobs(){
    this.isLoading = true
    this._companyService.getAllJobs(this.QueryParms)
    .subscribe({
      next:(res=>{
        console.log('responce for Get allJobs: ',res)
        if(res.success){
          this.jobs = res.data
          this.paginationMeta = res.meta ?? this.paginationMeta
        }
        this.isLoading = false
        this._cdr.detectChanges()
      }),
      error:(err =>{
        console.log("error get from  getalljobs : ",err)
        this.isLoading = false
        this._swal.showErrorToast(err.error.message)
        this._cdr.detectChanges()
      })
    })
  }

  onLimitChange(limit:number){
    this.QueryParms.limit = limit,
    this.QueryParms.page = 1
    this.fetchAllJobs()
  }

  onPageChange(newPage:number){
    this.QueryParms.page = newPage
    this.fetchAllJobs()
  }

  onSearchInput(event:Event){
    const term = (event.target as HTMLInputElement).value
    this.serchValue.next(term)
  }

  onRowSelected(row: any): void {
    console.log('Row selected:', row);
  }

  get Pagenumbers():number[]{
    const pageNumber:number[]= []
    for(let i=1; i<=this.paginationMeta.totalItems;i++){
      pageNumber.push(i)
    }
    return pageNumber
  }

  updateAction(event:{action:string, row:JobsInterface}){
    const {action, row} = event

    if(action === 'viewDetails'){
      this.showJobDetails(row)
    }else if(action === 'viewApplications'){
      this.showApplciations(row)
    }
  }

  showApplciations(row:JobsInterface){
    this._router.navigate(['company/joblist/applications',row._id],
      {state:{jobDetails:row}}
    )
    localStorage.setItem('jobDetails', JSON.stringify(row));
  }

  showJobDetails(row:JobsInterface) {
    this._router.navigate(['company/joblist/jobview'],{queryParams:{id:row._id}});
  }
}
