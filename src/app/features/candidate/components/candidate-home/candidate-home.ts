import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { CandidateService } from '../../services/candidate.service';
import { CandidateJobsInterface } from '../../interfaces/candidate.joblist.interface';
import { ComapnyProfileInterface } from '../../interfaces/candidate.companylist.interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../../env/environment';

@Component({
  selector: 'app-candidate-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './candidate-home.html',
  styleUrl: './candidate-home.css',
})
export class CandidateHome implements OnInit {
  private destroy$ = new Subject<void>();
  jobs: CandidateJobsInterface[] = [];
  companies: ComapnyProfileInterface[] = [];
  isLoading = true;
  baseUrl = environment.cloudinaryBaseUrl

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
          console.log('jobs :',this.jobs, 'comapnyes :',this.companies)
          this.isLoading = false;
          this._cdr.detectChanges()
        },
        error: (err) => {
          console.error('Error fetching home data:', err);
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
