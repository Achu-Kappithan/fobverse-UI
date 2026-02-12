import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { CandidateService } from '../../services/candidate.service';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { PaginationMeta } from '../../../../shared/interfaces/api-response.interface';
import { CandidateJobsInterface, CandidatejobType, jobsPagesAndFilterInterface } from '../../interfaces/candidate.joblist.interface';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CandidateApplyJobComponent } from '../candidate-apply-job/candidate-applyjob';
import { environment } from '../../../../../env/environment';
import { AuthService } from '../../../auth/services/auth.service';
import { UserPartial } from '../../../../shared/interfaces/api-response.interface';


@Component({
  selector: 'app-candidate-joblist',
  imports: [CommonModule,FormsModule,RouterModule,CandidateApplyJobComponent],
  templateUrl: './candidate-joblist.html',
  styleUrl: './candidate-joblist.css'
})
export class CandidateJobListComponent  implements OnInit, OnDestroy {
  baseUrl:string = environment.cloudinaryBaseUrl
  listView = false
  private readonly _logger = inject(LoggerService);
  isLoading = false
  isApplyModalOpen = false;
  selectedJob: CandidateJobsInterface | null = null;
  candidate: UserPartial | null = null;

  jobList:CandidateJobsInterface[] = []


  private destroy$ = new Subject<void>();
  searchValue = new Subject<string>()

  selectedJobTypes: string[] = []; 
  selectedMinSalary: number | null = null;
  selectedMaxSalary: number | null = null;
  selectedDueDate: string | null = null;

  availableJobTypes = [
    { name: CandidatejobType.FullTime }, 
    { name: CandidatejobType.PartTime },
    { name: CandidatejobType.OnSite },
    { name: CandidatejobType.Remote }
  ];

  salaryRanges = [
    { label: 'Any', min: null, max: null },
    { label: '₹0 - 20k', min: 0, max: 20000 },
    { label: '₹20k - 40k', min: 20000, max: 40000 },
    { label: '₹40k - 60k', min: 40000, max: 60000 },
    { label: '₹60k - 80k', min: 60000, max: 80000 },
    { label: '₹80k - 100k', min: 80000, max: 100000 },
    { label: '₹100k+', min: 100000, max: null },
  ];
  selectedSalaryRangeOption: { label: string, min: number | null, max: number | null } = this.salaryRanges[0];

  constructor(
    private readonly _candidateService:CandidateService,
    private readonly _cdr:ChangeDetectorRef,
    private readonly _toast:ToastService,
    private readonly _authService:AuthService
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

    this._authService.candidate$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (can) => {
        this.candidate = can;
        this._cdr.detectChanges();
      },
    });

    this.searchValue.pipe(

      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
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
        this._logger.log("Fetched jobs:", res.data?.length);
        if(res.success){
          this.jobList = res.data

          this.paginationMeta = res.meta!
          this.isLoading =false
          this._cdr.detectChanges()
        }
      }),
      error:(err)=>{
        this._logger.error('Error fetching jobs:', err);
        this._toast.error(err.error.message)
        this.isLoading = false
        this._cdr.detectChanges()
      }
    })
  }

  onSearchInput(event:Event){
    const term = (event.target as HTMLInputElement).value
    this._logger.log('Search term changed:', term);
    this.searchValue.next(term)
  }

  onLimitChange(limit:number){
    this.QueryParms.limit = limit
    this.QueryParms.page =1
    this.fetchAllJobs()
  }

  onPageChange(page:number){
    this.QueryParms.page = page;
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
    if (!this.candidate) {
      this._toast.warning('Login Required', 'Please login as a candidate to apply for jobs');
      return;
    }
    this.selectedJob = job;
    this.isApplyModalOpen = true;
  }


  isModalOpen(jobId: string): boolean {
    return this.isApplyModalOpen && this.selectedJob?._id === jobId;
  }

  closeModal(): void {
    this.isApplyModalOpen = false;
    this.selectedJob = null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
