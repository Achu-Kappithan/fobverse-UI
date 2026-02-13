import { ChangeDetectorRef, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { CandidateService } from '../../services/candidate.service';
import { CandidateJobsInterface } from '../../interfaces/candidate.joblist.interface';
import { CompanyProfileInterface } from '../../interfaces/candidate.companylist.interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../../env/environment';

import { LoadingSpinnerComponent } from '../../../../common/loading-spinner/loading-spinner';

@Component({
  selector: 'app-candidate-home',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './candidate-home.html',
  styleUrl: './candidate-home.css',
})
export class CandidateHomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  jobs: CandidateJobsInterface[] = [];
  companies: CompanyProfileInterface[] = [];
  isLoading = true;
  baseUrl = environment.cloudinaryBaseUrl
  private readonly _logger = inject(LoggerService);

  constructor(
    private _authService: AuthService,
    private _candidateService: CandidateService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    this._candidateService.getHomeDataPublic()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.jobs = res.data?.jobs || [];
          this.companies = res.data?.companies || [];
          this._logger.log('Home data loaded', { jobs: this.jobs.length, companies: this.companies.length });
          this.isLoading = false;
          this._cdr.detectChanges()
        },
        error: (err) => {
           this._logger.error('Error fetching home data:', err);
          this.isLoading = false;
          this._cdr.detectChanges()
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
