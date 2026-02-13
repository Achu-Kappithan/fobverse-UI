import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { APP_ROUTES } from '../../../../shared/constants/routes.constants';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CompanyApplication } from '../../services/company-application';
import { ApplicationInterface } from '../../interfaces/company.response.interface';
import { environment } from '../../../../../env/environment';

import { LoadingSpinnerComponent } from '../../../../common/loading-spinner/loading-spinner';

@Component({
  selector: 'app-all-applicants',
  standalone: true,
  imports: [CommonModule,LoadingSpinnerComponent,FormsModule,RouterModule],
  templateUrl: './all-applicants.html',
  styleUrls: ['./all-applicants.css']
})
export class AllApplicantsComponent implements OnInit {
  private readonly _companyService = inject(CompanyApplication);
  private readonly _router = inject(Router);
  private readonly _cdr = inject(ChangeDetectorRef);
  private readonly _toast = inject(ToastService);
  private readonly _logger = inject(LoggerService);
  isLoading = false;

  baseUrl:string = environment.cloudinaryBaseUrl

  applicants: ApplicationInterface[] = [];
  searchQuery = '';
  selectedStage = '';
  currentPage = 1;
  pageSize = 5;
  totalApplicants = 0;

  hiringStages = [
    { value: '', label: 'All Stages' },
    { value: 'default', label: 'In Review' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'technical_analysis', label: 'Technical' },
    { value: 'hired', label: 'Hired' },
  ];

  ngOnInit(): void {
    this.fetchApplicants();
  }

  fetchApplicants(): void {
    this.isLoading = true;
    this._companyService.getCompanyApplicants({
      page: this.currentPage,
      limit: this.pageSize,
      search: this.searchQuery,
      filtervalue: this.selectedStage
    }).subscribe({
      next: (res) => {
        this.applicants = res.data;
        this.totalApplicants = res.meta?.totalItems || 0;
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: (err) => {
        this._logger.error('Error fetching applicants:', err);
        this._toast.error(err.error?.message || 'Failed to fetch applicants');
        this.isLoading = false;
        this._cdr.detectChanges();
      }
    });
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.fetchApplicants();
  }

  onStageFilterChange(): void {
    this.currentPage = 1;
    this.fetchApplicants();
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.fetchApplicants();
  }

  get totalPages(): number {
    return Math.ceil(this.totalApplicants / this.pageSize);
  }

  get pages(): number[] {
    const total = this.totalPages;
    if (total <= 0) return [];
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  viewApplication(applicantId: string, jobId: string, canId: string): void {
    if (!jobId || !applicantId || !canId) {
      this._logger.error('Navigation failed: Missing required IDs', { jobId, applicantId, canId });
      return;
    }

    this._logger.log('Navigating to application details:', { jobId, applicantId, canId });

    this._router.navigate([APP_ROUTES.COMPANY_JOB_APPLICATIONS, jobId, 'viewapplication', applicantId, canId])
      .then(success => {
        if (!success) {
          this._logger.error('Navigation failed! Path might be incorrect or guarded.');
        }
      })
      .catch(err => {
        this._logger.error('Navigation error:', err);
      });
  }

  getStageClass(stage: string): string {
    switch (stage) {
      case 'default': return 'stage-inreview';
      case 'shortlisted': return 'stage-shortlisted';
      case 'telephone': return 'stage-interviewed';
      case 'technical_analysis': return 'stage-interviewed';
      case 'hired': return 'stage-hired';
      default: return 'stage-inreview';
    }
  }

  getStageLabel(stage: string): string {
    switch (stage) {
      case 'default': return 'In Review';
      case 'shortlisted': return 'Shortlisted';
      case 'telephone': return 'Telephonic';
      case 'technical_analysis': return 'Technical';
      case 'hired': return 'Hired';
      default: return stage;
    }
  }

  getStatusClass(rejected: boolean): string {
    return rejected ? 'stage-rejected' : 'stage-hired';
  }

  getStatusLabel(rejected: boolean): string {
    return rejected ? 'Rejected' : 'Active';
  }
}
