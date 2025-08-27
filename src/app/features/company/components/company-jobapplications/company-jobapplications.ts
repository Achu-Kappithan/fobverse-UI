import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company-service';
import { ActivatedRoute } from '@angular/router';
import { SweetAlert } from '../../../../shared/services/sweet-alert';
import { PaginationMeta, QueryParmsInterface } from '../../../../shared/interfaces/apiresponce.interface';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ApplicationQureryInterface } from '../../interfaces/company.interface';
import { ApplicationInterface } from '../../interfaces/company.responce.interface';

@Component({
  selector: 'app-company-jobapplications',
  imports: [CommonModule,FormsModule],
  templateUrl: './company-jobapplications.html',
  styleUrl: './company-jobapplications.css'
})
export class CompanyJobapplications implements OnInit {
  title = 'social-media-assistant';
  activeView: string = 'all';
  jobId:string | null = null;
  isLoading:boolean = false;
  ApplicationList: ApplicationInterface[] = []

  searchTearms = new Subject<string>()
  private _subscription :Subscription = new Subscription()

  constructor(
    private readonly _CompanySevice:CompanyService,
    private readonly _router:ActivatedRoute,
    private readonly _swal: SweetAlert,
    private readonly _cdr: ChangeDetectorRef
  ){}

  paginationMeta:PaginationMeta = {
    currentPage :1,
    totalItems : 0,
    itemsPerPage : 6,
    totalPages : 0
  }

  QueryParams :ApplicationQureryInterface = {
    page: 1,
    limit: 6,
    search : '',
    filtervalue: '',
    jobId : this.jobId!
  }

  ngOnInit(): void {

    this._router.queryParams.subscribe(val => {
      this.jobId = val['id']
      if(this.jobId){
        this.QueryParams.jobId = this.jobId
        console.log(this.jobId)
        this.fetchAllApplicaton()
      }
    })

    this._subscription.add(
      this.searchTearms.
      pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((val) =>{
        this.QueryParams.search = val,
        this.QueryParams.page  = 1
        this.fetchAllApplicaton()
      })
    )
  }

  fetchAllApplicaton(){
    this.isLoading = true
    this._CompanySevice.getAllApplication(this.QueryParams).subscribe({
      next:(res =>{
        if(res.success && res.data){
          this.ApplicationList = res.data
          console.log("responce get from thebacked  for applciatons",this.ApplicationList)
          this.isLoading = false
          this._cdr.detectChanges()
        }
      }),
      error:(err =>{
        console.log("error regading ger application ",err)
        this._swal.showErrorToast(err.error.message)
        this.isLoading  = false 
        this._cdr.detectChanges()
      })
    })
  }

  setView(view:string) {
    this.activeView = view;
  }

  onLimitChange(limit:number){
    this.QueryParams.limit = limit
    this.QueryParams.page = 1
    this.fetchAllApplicaton()
  }

  onPageChange(newPage:number){
    if(newPage > 0 &&  newPage <= this.paginationMeta.totalPages){
      this.QueryParams.page = newPage
      this.fetchAllApplicaton()
    }
  }

  onfilterChange(event:Event){
    const value = (event.target as HTMLSelectElement).value
    this.QueryParams.filtervalue = value
    this.QueryParams.page = 1
    this.fetchAllApplicaton()
  }

  onSerchInput(event:Event){
    const term = (event.target as HTMLInputElement).value
    this.searchTearms.next(term)
  }

  get pagenumbers():number[]{
    const pageNumber:number[] = []
    for(let i =1; i< this.paginationMeta.totalItems;i++){
      pageNumber.push(i)
    }
    return pageNumber
  }
  removeUser(id:string){
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe()
  }
}
