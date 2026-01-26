import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { CandidateService } from '../../services/candidate.service';
import { CandidateApplication, ApplicationQueryParams } from '../../interfaces/candidate.application.interface';
import { environment } from '../../../../../env/environment';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './my-applications.html',
  styleUrl: './my-applications.css'
})
export class MyApplicationsComponent implements OnInit, OnDestroy {
  applications: CandidateApplication[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  itemsPerPage = 6;
  baseUrl = environment.cloudinaryBaseUrl

  searchControl = new FormControl('');
  stageControl = new FormControl('');

  private destroy$ = new Subject<void>();

  stages = [
    { value: '', label: 'All Stages' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'technical_analysis', label: 'Technical Interview' },
    { value: 'hired', label: 'Hired' },
  ];

  constructor(
    private _candidateService: CandidateService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadApplications();
    this.setupSearchDebounce();
    this.setupStageFilter();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupSearchDebounce(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.loadApplications();
        this._cdr.detectChanges();
      });
  }

  setupStageFilter(): void {
    this.stageControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage = 1;
        this.loadApplications();
        this._cdr.detectChanges();
      });
  }

  loadApplications(): void {
    this.loading = true;
    const params: ApplicationQueryParams = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      search: this.searchControl.value || undefined,
      stage: this.stageControl.value || undefined
    };

    this._candidateService.getMyApplications(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('My Applications Response:', response);
          this.applications = response.data;
          this.currentPage = response.meta.currentPage;
          this.totalPages = response.meta.totalPages;
          this.totalItems = response.meta.totalItems;
          this.itemsPerPage = response.meta.itemsPerPage;
          this.loading = false;
          this._cdr.detectChanges()
        },
        error: (error) => {
          console.error('Error loading applications:', error);
          this.loading = false;
          this.applications = [];
          this._cdr.detectChanges()
        }
      });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadApplications();
    }
  }

  getStatusColor(stage: string): string {
    switch (stage.toLowerCase()) {
      case 'hired':
        return 'bg-green-100 text-green-800 border-green-200 border';
      case 'shortlisted':
        return 'bg-blue-100 text-blue-800 border-blue-200 border';
      case 'technical_analysis':
        return 'bg-purple-50 text-purple-700 border-purple-100 border';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200 border';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 border';
    }
  }

  getJobTypeLabel(jobType: string): string {
    const typeMap: { [key: string]: string } = {
      'fulltime': 'Full Time',
      'parttime': 'Part Time',
      'contract': 'Contract',
      'remote': 'Remote',
      'onsite': 'On Site'
    };
    return typeMap[jobType.toLowerCase()] || jobType;
  }

  clearFilters(): void {
    this.itemsPerPage = 6;
    this.currentPage = 1;
    this.searchControl.setValue('', { emitEvent: false });
    this.stageControl.setValue('', { emitEvent: false });
    this.loadApplications();
    this._cdr.detectChanges();
  }

  getPaginationRange(): number[] {
    const range = [];
    const maxPages = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    let end = Math.min(this.totalPages, start + maxPages - 1);

    if (end - start < maxPages - 1) {
      start = Math.max(1, end - maxPages + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }
}
