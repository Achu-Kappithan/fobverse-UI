import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminCompanyService } from '../../services/admin-company-service';
import { CompanyInterface} from '../../interfaces/company.interface';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from '../../../../common/loading-spinner/loading-spinner';
import { SweetAlert } from '../../../../shared/services/sweet-alert';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { PaginationMeta, QueryParmsInterface } from '../../../../shared/interfaces/apiresponce.interface';

@Component({
  selector: 'app-admin-listcompanys',
  imports: [CommonModule, LoadingSpinner,FormsModule],
  templateUrl: './admin-listcompanys.html',
  styleUrl: './admin-listcompanys.css',
})
export class AdminListcompanys implements OnInit {
  companies: CompanyInterface[] = [];
  isLoading: boolean = false;
  logoUrl: string = '/profileimages/logodefault.jpg';

  paginationMeta:PaginationMeta ={
    totalItems:0,
    currentPage:1,
    itemsPerPage:6,
    totalPages:0
  }

  currentQueryParms: QueryParmsInterface = {
    page:1,
    limit: 6,
    search: ""
  }

  private searchTerms = new Subject<string>()

  constructor(
    private readonly _companyService: AdminCompanyService,
    private cdr: ChangeDetectorRef,
    private readonly _swal: SweetAlert
  ) {}

  ngOnInit(): void {
    this.fetchAllcompany();

    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.currentQueryParms.search = term
      this.currentQueryParms.page = 1
      this.fetchAllcompany()
    })
  }

  UpdateStatus(company: CompanyInterface): void {
    console.log('updatestaus', company._id);
    this._companyService.updateStatus(company._id).subscribe({
      next: (res) => {
        if (res.success) {
          company.isActive = !company.isActive;
          this.cdr.detectChanges();
          this._swal.showSuccessToast(res.message);
          console.log('status update responce ', res);
        } else {
          console.log('error regading updating status', res);
        }
      },
      error: (err) => {
        console.log('staus updation faild ', err);
        this._swal.showErrorToast(err.error.message);
      },
    });
  }

  fetchAllcompany() {
    this.isLoading = true;
      this._companyService.getAllCompanies(this.currentQueryParms).subscribe({
        next: (response) => {
          console.log("all company responce",response)
          if (response && response.success) {
            this.companies = response.data ?? [];
            this.paginationMeta = response.meta ?? this.paginationMeta
            console.log('assigneddata', this.companies, " meta :  ",this.paginationMeta);
          } else {
            console.error(
              'Failed to fetch companies or data is unsuccessful:',
              response
            );
            this.companies = [];
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching companies:', err);
          this.companies = [];
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  onPageChange(newPage: number): void {
    if (newPage > 0 && newPage <= this.paginationMeta.totalPages) {
      this.currentQueryParms.page = newPage;
      this.fetchAllcompany();
    }
  }

  onLimitChange(newLimit: number): void {
    this.currentQueryParms.limit = newLimit;
    this.currentQueryParms.page = 1;  
    this.fetchAllcompany();
  }

  onSearchInput(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerms.next(term); 
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.paginationMeta.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
