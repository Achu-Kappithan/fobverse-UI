
export interface InterviewFeedback {
  interviewerName: string;
  feedback: string;
  role?: string;
  avatarUrl?: string;
}

export interface StageDetail {
  stageName: string;
  stageType: 'qualified' | 'telephonic' | 'technical' | 'hired';
  date: string;
  status: 'Completed' | 'Pending' | 'In Progress';
  result?: 'Pass' | 'Fail';
  feedbacks?: InterviewFeedback[];
  finalFeedback?: string;
  description?: string;
}
