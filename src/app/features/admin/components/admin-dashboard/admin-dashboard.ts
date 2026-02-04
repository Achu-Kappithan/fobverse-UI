import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardService } from '../../services/admin-dashboard.service';
import { AdminDashboardStats } from '../../interfaces/admin-dashboard.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  stats: AdminDashboardStats | null = null;
  loading = true;
  error: string | null = null;
  currentDate = new Date();

  constructor(private dashboardService: AdminDashboardService) {}

  ngOnInit(): void {
    this.fetchStats();
  }

  fetchStats(): void {
    this.loading = true;
    this.dashboardService.getDashboardStats().subscribe({
      next: (response: any) => {
        this.stats = response.data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load dashboard statistics';
        this.loading = false;
        console.error(err);
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
