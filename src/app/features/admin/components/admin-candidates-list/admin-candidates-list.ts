import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminCandidate } from '../../services/admin-candidate';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../../common/loading-spinner/loading-spinner';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { PaginationMeta, QueryParmsInterface } from '../../../../shared/interfaces/api-response.interface';
import { CandidateInterface } from '../../../candidate/interfaces/candidate.interface';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { environment } from '../../../../../env/environment';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm/confirm.service';
import { LoggerService } from '../../../../shared/services/logger/logger.service';

@Component({
  selector: 'app-admin-candidates-list',
  imports: [CommonModule,LoadingSpinnerComponent,FormsModule,RouterModule],
  templateUrl: './admin-candidates-list.html',
  styleUrl: './admin-candidates-list.css',
})
export class AdminCandidatesListComponent  implements OnInit {
  isLoading = false
  candidates:CandidateInterface[] = []
  ChildRouteActive = false
  cludBaseUrl:string = environment.cloudinaryBaseUrl

  QueryParms : QueryParmsInterface = {
    page : 1,
    search: '',
    limit: 8
  }

  paginationMeta:PaginationMeta = {
    currentPage: 1,
    totalPages: 0,
    itemsPerPage:8,
    totalItems:0
  }

  searchTerms = new Subject<string>()

  constructor( 
    private readonly _adminCandidateService:AdminCandidate,
    private readonly _cdr :ChangeDetectorRef,
    private readonly _route:ActivatedRoute,
    private readonly _toast:ToastService,
    private readonly _confirmService: ConfirmService,
    private readonly _logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.checkChildRouteStatus()
    this.fetchAllCandidates()
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
    .subscribe(term => {
      this.QueryParms.search = term
      this.QueryParms.page = 1
      this.fetchAllCandidates()
    })
  }

  checkChildRouteStatus(): void {
    this.ChildRouteActive = this._route.firstChild !== null;
    this._cdr.detectChanges()
  }

  async UpdateStatus(candidate: CandidateInterface) {
    const isConfirmed = await this._confirmService.confirm({
      title: candidate.isActive ? 'Block User' : 'Unblock User',
      message: `Are you sure you want to ${candidate.isActive ? 'block' : 'unblock'} ${candidate.name}?`,
      type: candidate.isActive ? 'danger' : 'warning',
      confirmText: candidate.isActive ? 'Block' : 'Unblock',
      cancelText: 'Cancel'
    });

    if (!isConfirmed) return;

    this._adminCandidateService.updateStatus(candidate.id!).subscribe({
      next: (res) => {
        if (res.success) {
          candidate.isActive = !candidate.isActive;
          this._toast.success(res.message || 'Status updated successfully');
          this._cdr.detectChanges();
        }
      },
      error: (err) => {
        this._toast.error(err.error?.message || 'Failed to update status');
      }
    });
  }

  fetchAllCandidates():void{
    this.isLoading = true
      this._adminCandidateService.getAllCandidates(this.QueryParms).subscribe({
        next:(response)=>{
          if(response.success && response.data){
            this.candidates = response.data ?? []
            this.paginationMeta = response.meta ?? this.paginationMeta
            this._logger.log('Candidates fetched successfully');
          }else{
            this._logger.warn("failed to get response",response);
            this.candidates = []
          }
          this.isLoading = false
          this._cdr.detectChanges()
        },
        error:(err)=>{
          this._logger.error("error  while fetching the candiate list",err);
          this.candidates = []
          this.isLoading = false
          this._cdr.detectChanges()
        }
      })
  }


  onLimitChange(limit: number){
    this.QueryParms.limit = limit
    this.QueryParms.page = 1
    this.fetchAllCandidates()
  }

  onpageChange(newPage:number){
    if(newPage >0 && newPage <= this.paginationMeta.totalItems){
      this.QueryParms.page = newPage
      this.fetchAllCandidates()
    }
  }

  onSerchInput(event:Event){
    const term = (event.target as HTMLInputElement).value
    this.searchTerms.next(term)
  }

  get Pagenumbers():number[]{
    const pageNumber: number[] = []
    for(let i=1; i< this.paginationMeta.totalItems; i++){
      pageNumber.push(i)
    }
    return pageNumber
  }
}
