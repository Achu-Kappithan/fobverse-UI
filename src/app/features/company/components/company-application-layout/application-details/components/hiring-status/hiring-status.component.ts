import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(private readonly _applicationService: CompanyApplication) {}

  ngOnInit(): void {
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
      next: (response: any) => {
        if (response.success && response.data) {
          this.mapApiResponseToJourneyData(response.data);
        } else {
          this.errorMessage = 'Failed to fetch stage data';
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching all stages:', error);
        this.errorMessage = 'An error occurred while fetching data';
        this.isLoading = false;
      }
    });
  }

  mapApiResponseToJourneyData(data: any): void {
    this.journeyData = [];

    if (data.atsStage) {
      const atsStage: StageDetail = {
        stageName: 'Application Qualified',
        stageType: 'qualified',
        date: this.formatDate(data.atsStage.createdAt),
        status: data.atsStage.Rejected ? 'Completed' : 'Completed',
        description: `Candidate ${data.atsStage.name} has been qualified for this position with an ATS score of ${data.atsStage.atsScore}.`
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
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        status: 'Completed',
        description: 'Candidate has been selected for the position. Offer letter sent.'
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

  mapEvaluators(evaluators: any[]): InterviewFeedback[] | undefined {
    if (!evaluators || evaluators.length === 0) return undefined;

    return evaluators
      .filter(e => e.feedback)
      .map(evaluator => ({
        interviewerName: evaluator.interviewerName,
        feedback: evaluator.feedback || 'No feedback provided',
        role: evaluator.role,
        avatarUrl: evaluator.avatarUrl
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
