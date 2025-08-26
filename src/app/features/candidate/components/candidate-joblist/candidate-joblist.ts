import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CandidateService } from '../../services/candidate.service';
import { SweetAlert } from '../../../../shared/services/sweet-alert';
import { PaginationMeta } from '../../../../shared/interfaces/apiresponce.interface';
import { CandidateJobsInterface, CandidatejobType, jobsPagesAndFilterInterface } from '../../interfaces/candidate.joblist.interface';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CandidateApplyjob } from '../candidate-applyjob/candidate-applyjob';
import { environment } from '../../../../../env/environment';

@Component({
  selector: 'app-candidate-joblist',
  imports: [CommonModule,FormsModule,RouterModule,CandidateApplyjob],
  templateUrl: './candidate-joblist.html',
  styleUrl: './candidate-joblist.css'
})
export class CandidateJoblist  implements OnInit {
  baseUrl:string = environment.cloudinaryBaseUrl
  listView:boolean = false
  isLoading:boolean = false
  openModals = new Map<string,boolean>()
  selectedJobDetailsMap = new Map<string, CandidateJobsInterface>()

  jobList:CandidateJobsInterface[] = []

  searchValue = new Subject<string>()

  selectedJobTypes: string[] = []; 
  selectedMinSalary: number | null = null;
  selectedMaxSalary: number | null = null;
  selectedDueDate: string | null = null;

  availableJobTypes = [
    { name: CandidatejobType.FullTime, count: '?' }, 
    { name: CandidatejobType.PartTmime, count: '?' },
    { name: CandidatejobType.OnSite, count: '?' },
    { name: CandidatejobType.Remote, count: '?'}
  ];

  salaryRanges = [
    { label: 'Any', min: null, max: null },
    { label: '$0 - 20k', min: 0, max: 20000 },
    { label: '$20k - 40k', min: 20000, max: 40000 },
    { label: '$40k - 60k', min: 40000, max: 60000 },
    { label: '$60k - 80k', min: 60000, max: 80000 },
    { label: '$80k - 100k', min: 80000, max: 100000 },
    { label: '$100k+', min: 100000, max: null },
  ];
  selectedSalaryRangeOption: { label: string, min: number | null, max: number | null } = this.salaryRanges[0];

  constructor(
    private readonly _candidateService:CandidateService,
    private readonly _cdr:ChangeDetectorRef,
    private readonly _swal:SweetAlert
  ){}

  paginationMeta:PaginationMeta = {
    currentPage :1,
    totalPages : 0,
    totalItems: 0,
    itemsPerPage:4
  }

  QueryParms:jobsPagesAndFilterInterface ={
    page:1,
    limit:4,
    search:'',
    maxSalary: null,
    minSalary: null,
    jobType : [],
    dueDate: null
  }

  ngOnInit(): void {
    this.fetchAllJobs()

    this.searchValue.pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
    .subscribe( val =>{
      this.QueryParms.search = val
      this.QueryParms.page = 1
      this.fetchAllJobs()
    })

  }

  toggleView(){
    this.listView = !this.listView
  }

  fetchAllJobs(){
    this.isLoading = true
    this._candidateService.getAlljobs(this.QueryParms)
    .subscribe({
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

  onSearchInput(event:Event){
    const term = (event.target as HTMLInputElement).value
    console.log(term)
    this.searchValue.next(term)
  }

  onLimitChange(limit:number){
    this.QueryParms.limit = limit
    this.QueryParms.page =1
    this.fetchAllJobs()
  }

  onPageChange(page:number){
    this.QueryParms.page = page,
    this.fetchAllJobs()
  }

  onJobTypeChange(event: Event, jobType: string): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedJobTypes.push(jobType);
    } else {
      this.selectedJobTypes = this.selectedJobTypes.filter(type => type !== jobType);
    }
    this.QueryParms.jobType = this.selectedJobTypes;
    this.QueryParms.page = 1
    this.fetchAllJobs();
  }

  onSalaryRangeChange(): void {
    this.QueryParms.minSalary = this.selectedSalaryRangeOption.min;
    this.QueryParms.maxSalary = this.selectedSalaryRangeOption.max;
    this.QueryParms.page =1
    this.fetchAllJobs()
  }

  onDueDateChange(event: Event): void {
    this.QueryParms.dueDate = (event.target as HTMLInputElement).value;
    this.QueryParms.page = 1
    this.fetchAllJobs()
  }

  get Pagenumbers():number[]{
    const pageNumber:number[] =[]
    for(let i=1; i<=this.paginationMeta.totalPages;i++){
      pageNumber.push(i)
    }
    return pageNumber
  }

  toggleModal(jobId: string, job: CandidateJobsInterface): void {
    const currentState = this.openModals.get(jobId);
    this.openModals.set(jobId, !currentState);
    if (!currentState) {
      this.selectedJobDetailsMap.set(jobId, job);
    } else {
      this.selectedJobDetailsMap.delete(jobId); 
    }
  }

  isModalOpen(jobId:string):boolean{
    return this.openModals.get(jobId) || false
  }

  closeModal(jobId: string): void {
    this.openModals.set(jobId, false);
  }


}
