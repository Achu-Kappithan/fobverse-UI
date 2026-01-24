import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Schedule } from '../../interfaces/schedule.interface';
import { CompanyApplication } from '../../services/company-application';

@Component({
  selector: 'app-my-schedules',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './my-schedules.html',
  styleUrls: ['./my-schedules.css']
})
export class MySchedulesComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _cdr = inject(ChangeDetectorRef);
  private readonly _companyApplication = inject(CompanyApplication);

  schedules: Schedule[] = [];
  filteredSchedules: Schedule[] = [];
  searchQuery: string = '';
  selectedStage: string = '';
  selectedStatus: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalSchedules: number = 0;


  statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'Scheduled', label: 'Scheduled' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];

  ngOnInit(): void {
    this.fetchSchedules();
  }

  fetchSchedules(): void {
    this._companyApplication.getMySchedules().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.schedules = res.data;
          this.applyFilters();
        }
      },
      error: (err) => {
        console.error('Error fetching schedules:', err);
      },
    });
  }

  applyFilters(): void {
    let filtered = [...this.schedules];


    if (this.selectedStatus) {
      filtered = filtered.filter(schedule => schedule.status === this.selectedStatus);
    }

    this.totalSchedules = filtered.length;
    
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.filteredSchedules = filtered.slice(start, end);
    
    this._cdr.detectChanges();
  }

  onStageFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.applyFilters();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  get totalPages(): number {
    return Math.ceil(this.totalSchedules / this.pageSize);
  }

  get pages(): number[] {
    const total = this.totalPages;
    if (total <= 0) return [];
    return Array.from({ length: total }, (_, i) => i + 1);
  }


  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'status-scheduled';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  }

  viewApplication(schedule: Schedule): void {

    console.log('jobid', schedule.jobId, 'applicationId' ,schedule.applicationId, 'canidateaId',schedule.candidateId )
    if (!schedule.jobId || !schedule.applicationId || !schedule.candidateId) {
      console.error('Navigation failed: Missing required IDs', schedule);
      return;
    }

    this._router
      .navigate([
        '/company/joblist/applications',
        schedule.jobId,
        'viewapplication',
        schedule.applicationId,
        schedule.candidateId,
      ])
      .then((success) => {
        if (!success) {
          console.error('Navigation failed! Path might be incorrect or guarded.');
        }
      })
      .catch((err) => {
        console.error('Navigation error:', err);
      });
  }
}
