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
