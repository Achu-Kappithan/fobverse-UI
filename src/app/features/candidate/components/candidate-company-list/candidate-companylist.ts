import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { environment } from '../../../../../env/environment';
import { PaginationMeta } from '../../../../shared/interfaces/api-response.interface';
import {
  CompanyProfileInterface,
  companyListParamsInterface,
} from '../../interfaces/candidate.companylist.interface';

import { CandidateService } from '../../services/candidate.service';
import { ToastService } from '../../../../shared/services/toast/toast.service';

import { LoadingSpinnerComponent } from '../../../../common/loading-spinner/loading-spinner';

@Component({
  selector: 'app-candidate-companylist',
  imports: [CommonModule, FormsModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './candidate-companylist.html',
  styleUrl: './candidate-companylist.css',
})
export class CandidateCompanyListComponent implements OnInit {
  baseUrl: string = environment.cloudinaryBaseUrl;
  listView = false;
  isLoading = false;
  private readonly _logger = inject(LoggerService);

  companyList: CompanyProfileInterface[] = [];

  searchValue = new Subject<string>();

  paginationMeta: PaginationMeta = {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 6,
  };

  queryParams: companyListParamsInterface = {
    page: 1,
    limit: 6,
    search: '',
  };

  constructor(
    private readonly _candidateService: CandidateService,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.initialFetch();

    this.searchValue
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((val) => {
        this.queryParams.search = val;
        this.queryParams.page = 1;
        this.fetchCompanies();
      });
  }

  initialFetch() {
    this.isLoading = true;
    this._candidateService.getPublicCompanies(this.queryParams).subscribe({
      next: (res) => {

        this._logger.log('Fetched Companies:', res.data?.length);

        if (res.data) {
          this.companyList = res.data;
          if (res.meta) {
            this.paginationMeta = {
              currentPage: res.meta.currentPage,
              totalPages: res.meta.totalPages,
              totalItems: res.meta.totalItems,
              itemsPerPage: res.meta.itemsPerPage,
            };
          }
        }
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: (err: unknown) => {
        this._logger.error('Error fetching companies:', err);
        this._toast.error('Failed to load companies');
        this.isLoading = false;
        this._cdr.detectChanges();
      },
    });
  }

  fetchCompanies() {
    this.initialFetch();
  }

  toggleView() {
    this.listView = !this.listView;
  }

  onSearchInput(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.searchValue.next(term);
  }

  onPageChange(page: number) {
    this.queryParams.page = page;
    this.fetchCompanies();
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.paginationMeta.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
