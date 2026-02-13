import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { RouterModule } from '@angular/router';
import { CompanyService } from '../../services/company-service';
import { CompanyDashboardData } from '../../interfaces/company.response.interface';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../../env/environment';

import { LoadingSpinnerComponent } from '../../../../common/loading-spinner/loading-spinner';

@Component({
  selector: 'app-company.home',
  standalone: true,
  imports: [RouterModule, CommonModule, LoadingSpinnerComponent],
  templateUrl: './company.home.html',
  styleUrl: './company.home.css'
})
export class CompanyHomeComponent implements OnInit, OnDestroy {
  dashboardData: CompanyDashboardData | null = null;
  isLoading = true;
  error: string | null = null;
  private _destroy$ = new Subject<void>();
  baseUrl = environment.cloudinaryBaseUrl
  private readonly _logger = inject(LoggerService);

  constructor(
    private _companyService: CompanyService,
    private _cdr : ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this._companyService.getDashboardData()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (response) => {
          this._logger.log('Dashboard data loaded');
          if (response.success && response.data) {
            this.dashboardData = response.data;
          } else {
            this.error = 'Failed to load dashboard data';
          }
          this.isLoading = false;
          this._cdr.detectChanges()
        },
        error: (err) => {
          this._logger.error('Error loading dashboard:', err);
          this.error = 'An error occurred while fetching dashboard data';
          this.isLoading = false;
          this._cdr.detectChanges()
        }
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  getMaxAppCount(): number {
    if (!this.dashboardData?.jobStats?.length) return 0;
    return Math.max(...this.dashboardData.jobStats.map(s => s.applicationCount), 1);
  }

  getJobPercentage(count: number): number {
    const max = this.getMaxAppCount();
    return (count / max) * 100;
  }
}
