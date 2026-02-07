import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { LoggerService } from '../../../../../../shared/services/logger/logger.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CandidateService } from '../../../../services/candidate.service';
import { DetailedApplicationResponse } from '../../../../interfaces/candidate.application.interface';
import { CandidateHiringStatusComponent } from '../candidate-hiring-status/candidate-hiring-status.component';
import { environment } from '../../../../../../../env/environment';

@Component({
  selector: 'app-candidate-application-details',
  standalone: true,
  imports: [CommonModule, RouterModule, CandidateHiringStatusComponent],
  templateUrl: './candidate-application-details.component.html',
  styleUrls: ['./candidate-application-details.component.css']
})
export class CandidateApplicationDetailsComponent implements OnInit {
  applicationId: string | null = null;
  jobId: string | null = null;
  application: DetailedApplicationResponse | null = null;
  isLoading: boolean = false;
  baseUrl = environment.cloudinaryBaseUrl;
  currentTab: 'progress' | 'current' = 'progress';
  private readonly _logger = inject(LoggerService);

  constructor(
    private _route: ActivatedRoute,
    private _candidateService: CandidateService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      this.applicationId = params.get('appId');
      this.jobId = params.get('jobId');
      if (this.applicationId) {
        this.fetchApplicationDetails();
      }
    });
  }

  fetchApplicationDetails(): void {
    this.isLoading = true;
    this._candidateService.getApplicationDetails(this.applicationId!).subscribe({
      next: (response) => {
        if (response.success) {
          this._logger.log('Application details fetched');
          this.application = response.data;
        }
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: (error) => {
        this._logger.error('Error fetching application details:', error);
        this.isLoading = false;
        this._cdr.detectChanges();
      }
    });
  }

  getStatusColor(stage: string | undefined): string {
    if (this.application?.atsStage?.Rejected) {
      return 'bg-red-100 text-red-800 border-red-200 border';
    }
    if (!stage) return 'bg-gray-100 text-gray-800 border-gray-200 border';
    switch (stage.toLowerCase()) {
      case 'hired':
        return 'bg-green-100 text-green-800 border-green-200 border';
      case 'shortlisted':
        return 'bg-blue-100 text-blue-800 border-blue-200 border';
      case 'technical_analysis':
        return 'bg-purple-100 text-purple-800 border-purple-200 border';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200 border';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 border';
    }
  }

  getCurrentStageData(): any {
    if (!this.application) return null;
    const currentStage = this.application.atsStage.Stages.toLowerCase();
    
    if (currentStage === 'shortlisted') {
      return this.application.shortlistedStage;
    } else if (currentStage === 'technical_analysis') {
      return this.application.techStage;
    }
    return null;
  }

  getEvaluatorNames(evaluators: any[]): string {
    if (!evaluators || evaluators.length === 0) return 'TBA';
    return evaluators.flat().map(e => e.interviewerName).join(', ');
  }

  switchTab(tab: 'progress' | 'current'): void {
    this.currentTab = tab;
  }
}
