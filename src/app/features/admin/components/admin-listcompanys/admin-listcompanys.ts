import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminCompanyService } from '../../services/admin-company-service';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from '../../../../common/loading-spinner/loading-spinner';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { PaginationMeta, QueryParmsInterface } from '../../../../shared/interfaces/apiresponce.interface';
import { ComapnyProfileInterface } from '../../../company/interfaces/company.responce.interface';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../../env/environment';
import { ConfirmService } from '../../../../shared/services/confirm/confirm.service';

@Component({
  selector: 'app-admin-listcompanys',
  imports: [CommonModule,LoadingSpinner,FormsModule,RouterModule],
  templateUrl: './admin-listcompanys.html',
  styleUrl: './admin-listcompanys.css',
})
export class AdminListcompanys implements OnInit {
  companies: ComapnyProfileInterface[] = [];
  isLoading: boolean = false;
  cludBaseUrl:string = environment.cloudinaryBaseUrl

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
    private _cdr: ChangeDetectorRef,
    private readonly _toast: ToastService,
    private readonly _confirmService: ConfirmService
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

  async UpdateStatus(company: ComapnyProfileInterface): Promise<void> {
    const isConfirmed = await this._confirmService.confirm({
      title: company.isActive ? 'Block Company' : 'Unblock Company',
      message: `Are you sure you want to ${company.isActive ? 'block' : 'unblock'} ${company.name}?`,
      type: company.isActive ? 'danger' : 'warning',
      confirmText: company.isActive ? 'Block' : 'Unblock',
      cancelText: 'Cancel'
    });

    if (!isConfirmed) return;

    console.log('updatestaus', company);
    this._companyService.updateStatus(company._id).subscribe({
      next: (res) => {
        if (res.success) {
          company.isActive = !company.isActive;
          this._cdr.detectChanges();
          this._toast.success(res.message);
          console.log('status update responce ', res);
        } else {
          console.log('error regading updating status', res);
        }
      },
      error: (err) => {
        console.log('staus updation faild ', err);
        this._toast.error(err.error.message);
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
          this._cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching companies:', err);
          this.companies = [];
          this.isLoading = false;
          this._cdr.detectChanges();
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
