import { Component, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { LoggerService } from '../../../../../../../shared/services/logger/logger.service';
import { CommonModule } from '@angular/common';
import { CompanyApplication } from '../../../../../services/company-application';

interface InterviewFeedback {
  interviewerName: string;
  feedback: string;
  role?: string;
  avatarUrl?: string;
}

interface StageDetail {
  stageName: string;
  stageType: 'qualified' | 'telephonic' | 'technical' | 'hired';
  date: string;
  status: 'Completed' | 'Pending' | 'In Progress';
  result?: 'Pass' | 'Fail';
  feedbacks?: InterviewFeedback[];
  finalFeedback?: string;
  description?: string;
}

@Component({
  selector: 'app-hiring-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hiring-status.component.html',
  styleUrls: ['./hiring-status.component.css']
})
export class HiringStatusComponent implements OnInit, OnChanges {
  @Input() status: string | null = null;
  @Input() applicationId: string | null = null;

  journeyData: StageDetail[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  private readonly _logger = inject(LoggerService);

  constructor(private readonly _applicationService: CompanyApplication) {}

  ngOnInit(): void {
    if (this.applicationId) {
      this.fetchAllStages();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['applicationId'] && this.applicationId) {
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

    this._applicationService.getAllStages(this.applicationId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.mapApiResponseToJourneyData(response.data as Record<string, unknown>);
        } else {
          this.errorMessage = 'Failed to fetch stage data';
        }
        this.isLoading = false;
      },
      error: (error: unknown) => {
        this._logger.error('Error fetching all stages:', error);
        this.errorMessage = 'An error occurred while fetching data';
        this.isLoading = false;
      }
    });
  }

  mapApiResponseToJourneyData(data: Record<string, unknown>): void {
    this.journeyData = [];

    if (data['atsStage']) {
      const atsStageData = data['atsStage'] as Record<string, unknown>;
      const atsStage: StageDetail = {
        stageName: 'Application Qualified',
        stageType: 'qualified',
        date: this.formatDate(atsStageData['createdAt'] as string),
        status: atsStageData['Rejected'] ? 'Completed' : 'Completed',
        description: `Candidate ${atsStageData['name']} has been qualified for this position with an ATS score of ${atsStageData['atsScore']}.`
      };
      this.journeyData.push(atsStage);
    }

    if (data['shortlistedStage']) {
      const shortlistedStageData = data['shortlistedStage'] as Record<string, unknown>;
      const shortlistedStage: StageDetail = {
        stageName: 'Telephonic Interview',
        stageType: 'telephonic',
        date: this.formatDate(shortlistedStageData['scheduledDate'] as string),
        status: this.mapStatus(shortlistedStageData['status'] as string),
        result: this.mapResult(shortlistedStageData['finalResult'] as string),
        finalFeedback: (shortlistedStageData['overallFeedback'] as string) || undefined,
        feedbacks: this.mapEvaluators(shortlistedStageData['evaluators'] as unknown[])
      };
      this.journeyData.push(shortlistedStage);
    }

    if (data['techStage']) {
      const techStageData = data['techStage'] as Record<string, unknown>;
      const techStage: StageDetail = {
        stageName: 'Technical Interview',
        stageType: 'technical',
        date: this.formatDate(techStageData['scheduledDate'] as string),
        status: this.mapStatus(techStageData['status'] as string),
        result: this.mapResult(techStageData['finalResult'] as string),
        finalFeedback: (techStageData['overallFeedback'] as string) || undefined,
        feedbacks: this.mapEvaluators(techStageData['evaluators'] as unknown[])
      };
      this.journeyData.push(techStage);
    }

    if (this.status === 'hired') {
      const atsStageData = data['atsStage'] as Record<string, unknown> | undefined;
      const techStageData = data['techStage'] as Record<string, unknown> | undefined;
      const hiredStage: StageDetail = {
        stageName: 'Hired',
        stageType: 'hired',
        date: atsStageData?.['updatedAt'] ? this.formatDate(atsStageData['updatedAt'] as string) : this.formatDate(new Date().toISOString()),
        status: 'Completed',
        description: 'Candidate has successfully completed all interview stages and has been officially hired for the position.',
        finalFeedback: (techStageData?.['overallFeedback'] as string) || undefined
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

  mapEvaluators(evaluators: unknown[]): InterviewFeedback[] | undefined {
    if (!evaluators || evaluators.length === 0) return undefined;

    return evaluators
      .filter(e => (e as Record<string, unknown>)['feedback'])
      .map(evaluator => {
        const ev = evaluator as Record<string, unknown>;
        return {
          interviewerName: ev['interviewerName'] as string,
          feedback: (ev['feedback'] as string) || 'No feedback provided',
          role: ev['role'] as string | undefined,
          avatarUrl: ev['avatarUrl'] as string | undefined
        };
      });
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
