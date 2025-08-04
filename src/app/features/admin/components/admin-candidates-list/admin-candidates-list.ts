import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside';
import { AdminCandidate } from '../../services/admin-candidate';
import { CandidateInterface, QueryParmsInterface } from '../../interfaces/company.interface';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from '../../../../common/loading-spinner/loading-spinner';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { PaginationMeta } from '../../../../shared/interfaces/apiresponce.interface';

@Component({
  selector: 'app-admin-candidates-list',
  imports: [ClickOutsideDirective, CommonModule,LoadingSpinner,FormsModule],
  templateUrl: './admin-candidates-list.html',
  styleUrl: './admin-candidates-list.css',
})
export class AdminCandidatesList  implements OnInit {
  isdorpDownOpen: { [id: string]: boolean } = {};
  isLoading:boolean = false
  candidates:CandidateInterface[] = []
  profileImage:string ='/profileimages/defaultProfile.jpg'

  QueryParms : QueryParmsInterface = {
    page : 1,
    search: '',
    limit: 6
  }

  paginationMeta:PaginationMeta = {
    currentPage: 1,
    totalPages: 0,
    itemsPerPage:6,
    totalItems:0
  }

  searchTerms = new Subject<string>()

  constructor( 
    private readonly _adminCandidateService:AdminCandidate,
    private readonly cdr :ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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

  UpdateStatus(candidate:CandidateInterface){
    this._adminCandidateService.updateStatus(candidate.id).subscribe({
      next:(res)=>{
        if(res.success){
          console.log("updated status ",res)
          candidate.isActive = !candidate.isActive
          this.cdr.detectChanges()
        }
      }
    })
  }

  fetchAllCandidates():void{
    this.isLoading = true
      this._adminCandidateService.getAllCandidates(this.QueryParms).subscribe({
        next:(response)=>{
          if(response.success && response.data){
            this.candidates = response.data ?? []
            this.paginationMeta = response.meta ?? this.paginationMeta
            console.log("responce data",response.data, " responce meta: ",response.meta)
          }else{
            console.log("faild to get responce",response)
            this.candidates = []
          }
          this.isLoading = false
          this.cdr.detectChanges()
        },
        error:(err)=>{
          console.log("error  while fetching the candiate list",err)
          this.candidates = []
          this.isLoading = false
          this.cdr.detectChanges()
        }
      })
  }

  toggleDropdown(id: string) {
    this.isdorpDownOpen[id] = !this.isdorpDownOpen[id];
    console.log(this.isdorpDownOpen)
  }

  closeDropdown(id: string) {
    this.isdorpDownOpen[id] = false;
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
