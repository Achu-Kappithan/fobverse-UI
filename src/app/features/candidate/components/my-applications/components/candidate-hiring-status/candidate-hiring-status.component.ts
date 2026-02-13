import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { LoggerService } from '../../../../../../shared/services/logger/logger.service';
import { CommonModule } from '@angular/common';
import { CandidateService } from '../../../../services/candidate.service';
import { DetailedApplicationResponse } from '../../../../interfaces/candidate.application.interface';
import { InterviewFeedback, StageDetail } from '../../../../interfaces/candiate.application.interface';

@Component({
  selector: 'app-candidate-hiring-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candidate-hiring-status.component.html',
  styleUrls: ['./candidate-hiring-status.component.css']
})
export class CandidateHiringStatusComponent implements OnChanges {
  @Input() status: string | null = null;
  @Input() applicationId: string | null = null;
  @Input() fullData: DetailedApplicationResponse | null = null;

  journeyData: StageDetail[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  private readonly _logger = inject(LoggerService);

  constructor(private readonly _candidateService: CandidateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fullData'] && this.fullData) {
      this.mapApiResponseToJourneyData(this.fullData);
    } else if (changes['applicationId'] && this.applicationId && !this.fullData) {
      this.fetchAllStages();
    }
  }

  fetchAllStages(): void {
    if (!this.applicationId) {
      this.errorMessage = 'Application ID is required';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this._candidateService.getAllStages(this.applicationId).subscribe({
      next: (response: { success: boolean; data: DetailedApplicationResponse; message?: string }) => {
        if (response.success && response.data) {
          this.mapApiResponseToJourneyData(response.data);
        } else {
          this.errorMessage = 'Failed to fetch stage data';
        }
        this.isLoading = false;
      },
      error: (error: Error | Record<string, unknown>) => {
        this._logger.error('Error fetching all stages:', error);
        this.errorMessage = 'An error occurred while fetching data';
        this.isLoading = false;
      }
    });
  }

  mapApiResponseToJourneyData(data: DetailedApplicationResponse): void {
    this.journeyData = [];

    if (data.atsStage) {
      const atsStage: StageDetail = {
        stageName: 'Application Qualified',
        stageType: 'qualified',
        date: this.formatDate(data.atsStage.createdAt),
        status: 'Completed',
        result: data.atsStage.Rejected ? 'Fail' : 'Pass',
        description: data.atsStage.Rejected
          ? `Your application has been rejected for this position.`
          : `Your application has been qualified for this position with an ATS score of ${data.atsStage.atsScore}.`
      };
      this.journeyData.push(atsStage);
    }

    if (data.shortlistedStage) {
      const shortlistedStage: StageDetail = {
        stageName: 'Telephonic Interview',
        stageType: 'telephonic',
        date: this.formatDate(data.shortlistedStage.scheduledDate),
        status: this.mapStatus(data.shortlistedStage.status),
        result: this.mapResult(data.shortlistedStage.finalResult),
        finalFeedback: data.shortlistedStage.overallFeedback || undefined,
        feedbacks: this.mapEvaluators(data.shortlistedStage.evaluators)
      };
      this.journeyData.push(shortlistedStage);
    }

    if (data.techStage) {
      const techStage: StageDetail = {
        stageName: 'Technical Interview',
        stageType: 'technical',
        date: this.formatDate(data.techStage.scheduledDate),
        status: this.mapStatus(data.techStage.status),
        result: this.mapResult(data.techStage.finalResult),
        finalFeedback: data.techStage.overallFeedback || undefined,
        feedbacks: this.mapEvaluators(data.techStage.evaluators)
      };
      this.journeyData.push(techStage);
    }

    if (this.status === 'hired') {
      const hiredStage: StageDetail = {
        stageName: 'Hired',
        stageType: 'hired',
        date: data.atsStage?.updatedAt ? this.formatDate(data.atsStage.updatedAt) : this.formatDate(new Date().toISOString()),
        status: 'Completed',
        description: 'Congratulations! You have successfully completed all interview stages and have been officially hired for the position.'
      };
      this.journeyData.push(hiredStage);
    }
  }

  mapStatus(status: string): 'Completed' | 'Pending' | 'In Progress' {
    if (!status) return 'Pending';

    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus === 'completed' || normalizedStatus === 'done') {
      return 'Completed';
    } else if (normalizedStatus === 'scheduled' || normalizedStatus === 'in progress') {
      return 'In Progress';
    }
    return 'Pending';
  }

  mapResult(result: string): 'Pass' | 'Fail' | undefined {
    if (!result) return undefined;

    const normalizedResult = result.toLowerCase();
    if (normalizedResult === 'pass' || normalizedResult === 'selected') {
      return 'Pass';
    } else if (normalizedResult === 'fail' || normalizedResult === 'rejected') {
      return 'Fail';
    }
    return undefined;
  }

  mapEvaluators(evaluators: Record<string, unknown>[]): InterviewFeedback[] | undefined {
    if (!evaluators || evaluators.length === 0) return undefined;
    const flatEvaluators = evaluators.flat();

    return flatEvaluators
      .filter(e => e['feedback'] || e['interviewerName'])
      .map((evaluator: Record<string, unknown>) => ({
        interviewerName: (evaluator['interviewerName'] as string) || 'Interviewer',
        feedback: (evaluator['feedback'] as string) || 'No feedback provided',
        role: evaluator['role'] as string,
        avatarUrl: evaluator['avatarUrl'] as string
      }));
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
