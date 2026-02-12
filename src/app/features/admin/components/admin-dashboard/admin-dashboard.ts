import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { CommonModule } from '@angular/common';
import { AdminDashboardService } from '../../services/admin-dashboard.service';
import { AdminDashboardStats } from '../../interfaces/admin-dashboard.interface';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../../env/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboardComponent implements OnInit {
  stats: AdminDashboardStats | null = null;
  loading = true;
  error: string | null = null;
  private readonly _logger = inject(LoggerService);
  currentDate = new Date();
  baseUrl: string  = environment.cloudinaryBaseUrl

  constructor(
    private _dashboardService: AdminDashboardService,
    private _cdr : ChangeDetectorRef,

  ) {}

  ngOnInit(): void {
    this.fetchStats();
  }

  fetchStats(): void {
    this.loading = true;
    this._dashboardService.getDashboardStats().subscribe({
      next: (response) => {
        this._logger.log('Dashboard stats fetched');
        this.stats = response.data;
        this.loading = false;
        this._cdr.detectChanges()
      },
      error: (err: unknown) => {
        this.error = 'Failed to load dashboard statistics';
        this.loading = false;
        this._cdr.detectChanges()
        this._logger.error('Failed to load dashboard statistics:', err);
      },
    });
  }

  getJobTypeCount(type: string): number {
    return this.stats?.jobTypeStats[type] || 0;
  }

  getJobTypePercentage(count: number): number {
    if (!this.stats || this.stats.totalJobs === 0) return 0;
    return (count / this.stats.totalJobs) * 100;
  }
}
