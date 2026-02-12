import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LoggerService } from '../../../../../shared/services/logger/logger.service';
import { RouterModule } from '@angular/router';
import { InternalUserInterface } from '../../../interfaces/company.response.interface';
import { CompanyService } from '../../../services/company-service';
import { LoadingSpinnerComponent } from '../../../../../common/loading-spinner/loading-spinner';
import { CommonModule } from '@angular/common';
import { RoleDisplayPipe } from '../../../../../shared/pipes/role-display-pipe';
import { PaginationMeta, QueryParmsInterface } from '../../../../../shared/interfaces/api-response.interface';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { environment } from '../../../../../../env/environment';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { ConfirmService } from '../../../../../shared/services/confirm/confirm.service';

@Component({
  selector: 'app-user-list.component',
  imports: [RouterModule,CommonModule,LoadingSpinnerComponent,RoleDisplayPipe,FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit, OnDestroy {

  cloudinaryBaseUrl = environment.cloudinaryBaseUrl
  private readonly _logger = inject(LoggerService);

  private _subscriptions : Subscription = new Subscription()
  
  isLoading = false
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
    private readonly _companyService: CompanyService,
    private  _cdr: ChangeDetectorRef,
    private readonly _toast:ToastService,
    private readonly _confirmService: ConfirmService,
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
    this._logger.log('Internal users initialized');
  }


  fetchAllInternalUsers(){
    this.isLoading = true
    this._companyService.getInternalUsers(this.QueryParams).subscribe({
      next:(res =>{
        if(res.success){
          this._logger.log("internal users fetched:", res.data?.length);
          this.InternalUsers = res.data
          this.paginationMeta = res.meta ?? this. paginationMeta
        }
        this.isLoading = false
        this._cdr.detectChanges()
      }),
      error:(err =>{
        this._logger.error('Error fetching internal users:', err);
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

  async removeUser(id:string,index:number){
    this._logger.log("Removing user at index:", index);
    
    const confirmed = await this._confirmService.confirm({
      title: 'Remove User',
      message: 'Are you sure you want to remove this internal user? This action cannot be undone.',
      confirmText: 'Remove',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (!confirmed) return;

    this._companyService.removeUser(id).subscribe({
      next:(res =>{
        if(res.success){
          this._toast.success(res.message)
          this.InternalUsers.splice(index,1)
          this._cdr.detectChanges()
        }
      }),
      error:(err =>{
        this._logger.error("error regarding removing user", err)
        this._toast.error(err.error.message)
      })
    })
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe()
  }
}
