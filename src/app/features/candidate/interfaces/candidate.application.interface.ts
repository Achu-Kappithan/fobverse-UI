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

export interface ApplicationsResponse {
  data: CandidateApplication[];
  message: string;
  currentPage: number;
  totalItems: number;
  totalPages: number;
  itemsPerPage: number;
}

export interface ApplicationQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  stage?: string;
}
