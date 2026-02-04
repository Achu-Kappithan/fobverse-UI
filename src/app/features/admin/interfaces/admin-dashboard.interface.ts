export interface JobTypeStats {
  fulltime: number;
  parttime: number;
  remote: number;
  onsite: number;
  internship: number;
  contract: number;
  [key: string]: number;
}

export interface RecentJob {
  _id: string;
  title: string;
  companyName: string;
  location: string;
  jobType: string;
  applicantsCount: number;
  logo: string;
}

export interface AdminDashboardStats {
  totalCandidates: number;
  totalCompanies: number;
  totalApplications: number;
  totalJobs: number;
  activeJobs: number;
  jobTypeStats: JobTypeStats;
  recentJobs: RecentJob[];
}
