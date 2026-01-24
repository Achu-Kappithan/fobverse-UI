export interface Schedule {
  _id: string;
  applicationId: string;
  stage: string;
  scheduledDate: string;
  scheduledTime: string;
  meetingLink: string;
  status: string;
  evaluators?: any[];
  candidateName?: string;
  jobTitle?: string;
  candidateId?: string;
  jobId?: string;
}
