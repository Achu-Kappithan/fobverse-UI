export interface CandidateApplication {
  _id: string;
  applicationStatus: boolean;
  Stages: string;
  Rejected: boolean;
  createdAt: string;
  updatedAt: string;
  companyName: string;
  companyLogo: string;
  jobRole: string;
  jobLocation: string[];
  jobType: string;
  atsScore: number;
  resumeUrl: string;
  jobId: string;
  companyId: string;
}


export interface ApplicationQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  stage?: string;
}

export interface InterviewStage {
  _id: string;
  applicationId: string;
  companyId: string;
  candidateId: string;
  jobId: string;
  scheduledDate: string;
  scheduledTime: string;
  status: string;
  meetingLink?: string;
  finalResult: string;
  overallFeedback?: string;
  evaluators: Record<string, unknown>[]; 
  createdAt: string;
  updatedAt: string;
}

export interface DetailedApplicationResponse {
  atsStage: {
    _id: string;
    companyId?: string;
    candidateId: string;
    name: string;
    Stages: string;
    Rejected: boolean;
    jobId: string;
    email: string;
    phone: string;
    qualification: string;
    atsScore: number;
    atsCriteria: number;
    experience: string;
    resumeUrl: string;
    createdAt: string;
    updatedAt: string;
    profile: Record<string, unknown>;
    jobDetails?: Record<string, unknown>;
  };
  shortlistedStage?: InterviewStage;
  techStage?: InterviewStage;
}
