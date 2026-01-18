import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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
export class HiringStatusComponent implements OnInit {
  @Input() status: string | null = null;

  journeyData: StageDetail[] = [];

  ngOnInit(): void {
    this.loadDummyData();
  }

  loadDummyData() {
    this.journeyData = [
      {
        stageName: 'Application Qualified',
        stageType: 'qualified',
        date: 'Jan 10, 2024',
        status: 'Completed',
        description: 'Candidate matches the required criteria for the Product Designer role.'
      },
      {
        stageName: 'Telephonic Interview',
        stageType: 'telephonic',
        date: 'Jan 12, 2024',
        status: 'Completed',
        result: 'Pass',
        finalFeedback: 'Strong communication skills and good cultural fit. Recommended for technical round.',
        feedbacks: [
          {
            interviewerName: 'Sarah Wilson',
            role: 'HR Manager',
            feedback: 'Candidate was very articulate and showed great enthusiasm for the role.',
            avatarUrl: 'https://i.pravatar.cc/150?u=sarah'
          }
        ]
      },
      {
        stageName: 'Technical Interview',
        stageType: 'technical',
        date: 'Jan 15, 2024',
        status: 'Completed',
        result: 'Pass',
        finalFeedback: 'Excellent technical knowledge. Successfully solved the coding challenge and demonstrated deep understanding of design principles.',
        feedbacks: [
          {
            interviewerName: 'David Chen',
            role: 'Senior Product Designer',
            feedback: 'Impressive portfolio walkthrough. Strong grasp of UX methodologies.',
            avatarUrl: 'https://i.pravatar.cc/150?u=david'
          },
          {
            interviewerName: 'Michael Brown',
            role: 'Tech Lead',
            feedback: 'Good problem-solving skills. Code was clean and efficient.',
            avatarUrl: 'https://i.pravatar.cc/150?u=michael'
          }
        ]
      },
      {
        stageName: 'Hired',
        stageType: 'hired',
        date: 'Jan 16, 2024',
        status: 'Completed',
        description: 'Candidate has been selected for the position. Offer letter sent.'
      }
    ];
  }
}
