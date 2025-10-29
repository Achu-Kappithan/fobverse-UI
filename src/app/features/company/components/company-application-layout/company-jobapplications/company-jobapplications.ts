import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CompanyService } from '../../../services/company-service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SweetAlert } from '../../../../../shared/services/sweet-alert';
import { PaginationMeta } from '../../../../../shared/interfaces/apiresponce.interface';
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
import { ApplicationInterface, JobsInterface } from '../../../interfaces/company.responce.interface';
import { environment } from '../../../../../../env/environment';

@Component({
  selector: 'app-company-jobapplications',
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './company-jobapplications.html',
  styleUrl: './company-jobapplications.css',
})
export class CompanyJobapplications implements OnInit {
  activeView: string = 'all';
  jobId: string | null = null;
  isLoading: boolean = false;
  ApplicationList: ApplicationInterface[] = [];
  baseUrl: string = environment.cloudinaryBaseUrl;
  modalId: string | null = null;
  atsForm!: FormGroup;
  currentJobdetails: JobsInterface | null = null

  searchTearms = new Subject<string>();
  private _subscription: Subscription = new Subscription();

  constructor(
    private readonly _CompanySevice: CompanyService,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _swal: SweetAlert,
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
    console.log('loaded job details',this.currentJobdetails)


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
          (this.QueryParams.search = val), (this.QueryParams.page = 1);
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
    }
  }

  fetchAllApplicaton() {
    this.isLoading = true;
    this._CompanySevice.getAllApplication(this.QueryParams).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.ApplicationList = res.data;
          this.paginationMeta = res.meta ? res.meta : this.paginationMeta;
          console.log(
            'responce get from thebacked  for applciatons',
            this.ApplicationList
          );
          this.isLoading = false;
          this._cdr.detectChanges();
        }
      },
      error: (err) => {
        console.log('error regading ger application ', err);
        this._swal.showErrorToast(err.error.message);
        this.isLoading = false;
        this._cdr.detectChanges();
      },
    });
  }

  submitNewScore() {
    if (this.atsForm.valid) {
      const value = { ...this.atsForm.value, jobId: this.jobId };
      console.log(value);
      this._CompanySevice.updateNewScore(value).subscribe({
        next: (res) => {
          if (res.success) {
            (this.ApplicationList = res.data),
              (this.paginationMeta = res.meta ? res.meta : this.paginationMeta);
            this.closeModal();
            this._cdr.detectChanges();
            this._swal.showSuccessToast(res.message);
          }
        },
        error: (err) => {
          console.log('error regading the update new score', err);
          this._swal.showErrorToast(err.error.message);
        },
      });
    } else {
      this.atsForm.markAllAsTouched;
      console.log('form is invalid');
    }
  }

  shortlistedApplications() {
    this.QueryParams.filtervalue = 'shortlisted';
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
    for (let i = 1; i < this.paginationMeta.totalPages; i++) {
      pageNumber.push(i);
    }
    return pageNumber;
  }
  removeUser(id: string) {}

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
