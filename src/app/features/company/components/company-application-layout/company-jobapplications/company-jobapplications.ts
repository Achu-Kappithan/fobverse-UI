import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { LoggerService } from '../../../../../shared/services/logger/logger.service';
import { CompanyService } from '../../../services/company-service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { PaginationMeta } from '../../../../../shared/interfaces/api-response.interface';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  Subscription,
} from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApplicationQureryInterface } from '../../../interfaces/company.interface';
import { ApplicationInterface, JobsInterface } from '../../../interfaces/company.response.interface';
import { environment } from '../../../../../../env/environment';
import { CompanyApplication } from '../../../services/company-application';

@Component({
  selector: 'app-company-jobapplications',
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './company-jobapplications.html',
  styleUrl: './company-jobapplications.css',
})
export class CompanyJobApplicationsComponent implements OnInit, OnDestroy {
  activeView = 'all';
  jobId: string | null = null;
  isLoading = false;
  ApplicationList: ApplicationInterface[] = [];
  baseUrl: string = environment.cloudinaryBaseUrl;
  modalId: string | null = null;
  atsForm!: FormGroup;
  currentJobdetails: JobsInterface | null = null

  searchTearms = new Subject<string>();
  private readonly _logger = inject(LoggerService);
  private _subscription: Subscription = new Subscription();

  constructor(
    private readonly _CompanySevice: CompanyService,
    private readonly _CompanyApplicationService: CompanyApplication,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _toast: ToastService,
    private readonly _cdr: ChangeDetectorRef,
    private _fb: FormBuilder
  ) {}

  paginationMeta: PaginationMeta = {
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: 4,
    totalPages: 0,
  };

  QueryParams: ApplicationQureryInterface = {
    page: 1,
    limit: 4,
    search: '',
    filtervalue: '',
    jobId: this.jobId!,
  };

  ngOnInit(): void {
    this.initForm();

    this.currentJobdetails = history.state?.['jobDetails']
    if (!this.currentJobdetails) {
    const saved = localStorage.getItem('jobDetails');
    this.currentJobdetails = saved ? JSON.parse(saved) : null;
    }
    this._logger.log('loaded job details',this.currentJobdetails);


    this._route.paramMap.subscribe((parms) => {
      this.jobId = parms.get('id');
      if (this.jobId) {
        this.QueryParams.jobId = this.jobId;
        this.fetchApplicaton();
      }
    });

    this._subscription.add(
      this.searchTearms
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((val) => {
          this.QueryParams.search = val;
          this.QueryParams.page = 1;
          this.fetchApplicaton();
        })
    );
  }

  initForm() {
    this.atsForm = this._fb.group({
      newscore: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.max(100),
          Validators.pattern(/^\d+$/),
        ],
      ],
    });
  }

  fetchApplicaton() {
    if (this.activeView === 'all') {
      this.QueryParams.filtervalue = '';
      this.QueryParams.page = 1;
      this.fetchAllApplicaton();
    } else if (this.activeView === 'shortlisted') {
      this.shortlistedApplications();
    } else if (this.activeView === 'technicals') {
      this.TechnicalApplications();
    } else if (this.activeView === 'hired') {
      this.hiredApplications();
    }
  }

  fetchAllApplicaton() {
    this.isLoading = true;
    this._CompanyApplicationService.getAllApplication(this.QueryParams).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.ApplicationList = res.data;
          this.paginationMeta = res.meta ? res.meta : this.paginationMeta;
          this._logger.log(
            'response get from the backed for applications',
            this.ApplicationList
          );
          this.isLoading = false;
          this._cdr.detectChanges();
        }
      },
      error: (err) => {
        this._logger.error('error regading ger application ', err);
        this._toast.error(err.error.message);
        this.isLoading = false;
        this._cdr.detectChanges();
      },
    });
  }

  submitNewScore() {
    if (this.atsForm.valid) {
      const value = { ...this.atsForm.value, jobId: this.jobId };
      this._logger.log(value);
      this._CompanySevice.updateNewScore(value).subscribe({
        next: (res) => {
          if (res.success) {
            this.ApplicationList = res.data;
            this.paginationMeta = res.meta ? res.meta : this.paginationMeta;
            this.closeModal();
            this._cdr.detectChanges();
            this._toast.success(res.message);
          }
        },
        error: (err) => {
          this._logger.error('error regading the update new score', err);
          this._toast.error(err.error.message);
        },
      });
    } else {
      this.atsForm.markAllAsTouched();
      this._logger.warn('form is invalid');
    }
  }

  shortlistedApplications() {
    this.QueryParams.filtervalue = 'shortlisted';
    this.QueryParams.page = 1;
    this.fetchAllApplicaton();
  }

  TechnicalApplications() {
    this.QueryParams.filtervalue = 'technical_analysis'
    this.QueryParams.page = 1;
    this.fetchAllApplicaton();
  }

  hiredApplications() {
    this.QueryParams.filtervalue = 'hired'
    this.QueryParams.page = 1;
    this.fetchAllApplicaton();
  }

  setView(view: string) {
    this.activeView = view;
    this.fetchApplicaton();
  }

  onLimitChange(limit: number) {
    this.QueryParams.limit = limit;
    this.QueryParams.page = 1;
    this.fetchApplicaton();
  }

  onPageChange(newPage: number) {
    if (newPage > 0 && newPage <= this.paginationMeta.totalPages) {
      this.QueryParams.page = newPage;
      this.fetchApplicaton();
    }
  }

  onfilterChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.QueryParams.filtervalue = value;
    this.QueryParams.page = 1;
    this.fetchApplicaton();
  }

  onSerchInput(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.searchTearms.next(term);
  }

  get pagenumbers(): number[] {
    const pageNumber: number[] = [];
    for (let i = 1; i <= this.paginationMeta.totalPages; i++) {
      pageNumber.push(i);
    }
    return pageNumber;
  }


  back() {
    this._router.navigate(['../'], { relativeTo: this._route });
  }

  openModal(id: string) {
    this.modalId = id;
  }

  isModalOpen(id: string): boolean {
    return this.modalId == id;
  }

  closeModal() {
    this.modalId = null;
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
