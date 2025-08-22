import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InternalUserInterface } from '../../../interfaces/company.responce.interface';
import { CompanyService } from '../../../services/company-service';
import { LoadingSpinner } from '../../../../../common/loading-spinner/loading-spinner';
import { CommonModule } from '@angular/common';
import { RoleDisplayPipe } from '../../../../../shared/pipes/role-display-pipe';
import { PaginationMeta, QueryParmsInterface } from '../../../../../shared/interfaces/apiresponce.interface';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-user-list.component',
  imports: [RouterModule,LoadingSpinner,CommonModule,RoleDisplayPipe,FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit, OnDestroy {

  private _subscriptions : Subscription = new Subscription()
  
  isLoading:boolean = false
  InternalUsers:InternalUserInterface[]=[]

  QueryParams :QueryParmsInterface = {
    page: 1,
    limit: 6,
    search : '',
    filtervalue: ''
  }

  paginationMeta : PaginationMeta = {
    totalItems: 0,
    currentPage: 1,
    itemsPerPage:6,
    totalPages:0
  }

  searchTearms = new Subject<string>()

  constructor(
    private readonly _ComapnyService: CompanyService,
    private  _cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.fetchAllInternalUsers()

    this._subscriptions.add(
      this.searchTearms.pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((term)=>{
        this.QueryParams.search = term
        this.QueryParams.page =1
        this.fetchAllInternalUsers()
      })
    )
  }

  fetchAllInternalUsers(){
    this.isLoading = true
    this._ComapnyService.getInternalUsers(this.QueryParams).subscribe({
      next:(res =>{
        if(res.success){
          console.log("internal useres :",res.data)
          this.InternalUsers = res.data
          this.paginationMeta = res.meta ?? this. paginationMeta
        }
        this.isLoading = false
        this._cdr.detectChanges()
      }),
      error:(err =>{
        console.log(err)
        this.isLoading= false
        this._cdr.detectChanges()
      })
    })

  }

  onLimitChange(limit:number){
    this.QueryParams.limit = limit
    this.QueryParams.page = 1
    this.fetchAllInternalUsers()
  }

  onPageChange(newPage:number){
    if(newPage > 0 &&  newPage <= this.paginationMeta.totalPages){
      this.QueryParams.page = newPage
      this.fetchAllInternalUsers()
    }
  }

  onfilterChange(event:Event){
    const value = (event.target as HTMLSelectElement).value
    this.QueryParams.filtervalue = value
    this.QueryParams.page = 1
    this.fetchAllInternalUsers()
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
    this._subscriptions.unsubscribe()
  }
}
