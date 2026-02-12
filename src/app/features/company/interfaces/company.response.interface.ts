import { CandidateInterface } from "../../candidate/interfaces/candidate.interface";



import { Schedule } from './schedule.interface';
export interface InternalUserInterface {
  _id:string
  
  name: string;

  email: string;

  role: string;

  profileImg?: string;

  password: string;
}

export interface UpdateInternalUserInterface {
  
  name: string;

  email: string;

  profileImg?: string;

}

export interface ContactInfoItem {
  type: string;

  value: string;
}

export interface TeamMember {
  name: string;

  role: string;

  image?: string | undefined
}

export interface CompanyProfileInterface {
  _id: string;

  userId: string;

  name: string;

  industry?: string;

  contactInfo?: ContactInfoItem [];

  officeLocation?: string[];

  techStack?: string[];

  imageGallery?:string[]

  logoUrl?: string;

  description?: string;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;

  teamMembers?: TeamMember[];

  benefits?:string[]
}

export enum jobType {
  FullTime = 'fulltime',
  PartTime = 'parttime',
  Remote = 'remote',
  OnSite = 'onsite'
}

export interface JobsInterface {
  _id?:string;

  companyId?:string

  title: string;

  description: string;

  responsibility:string

  jobType:jobType

  skills: string[];

  experience?: string[];

  salary: {
    min: number;
    max: number;
  };

  location: string[];

  vacancies: number;

  dueDate:string;

  createdAt:string
}

export interface populatedJobInterface {
  jobDetails:JobsInterface,
  profile: CompanyProfileInterface[]
}

export interface PopulatedCompanyProfile { 
  company: CompanyProfileInterface
  jobs:JobsInterface[]
}

export enum Stages {
  Default = 'default',
  Shortlisted = 'shortlisted',
  Scheduled = 'scheduled',
  Hired = 'hired',
}

export interface ApplicationInterface {
  _id: string;

  candidateId: string;

  name: string;

  Stages: Stages;

  Rejected: boolean;

  email: string;

  phone: string;

  atsScore: number;

  atsCriteria: number;

  qualification: string;

  experience: string;

  resumeUrl: string;

  profile?: { _id:string , profileImg: string} 

  createdAt:string

  jobId: string;

  jobDetails?: JobsInterface;
}

export interface applicationWithProfile {
  _id: string;

  candidateId: string;

  name: string;

  Stages: Stages;

  Rejected: boolean;

  email: string;

  phone: string;

  atsScore: number;

  atsCriteria: number;

  qualification: string;

  experience: string;

  resumeUrl: string;

  createdAt:string;

  profile: CandidateInterface
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: {
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
  };
  statusCode: number;
  timestamp: string;
}

export interface JobStat {
  jobId: string;
  jobTitle: string;
  applicationCount: number;
  active: boolean;
}

export interface CompanyDashboardData {
  stats: {
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    pendingApplications: number;
    hiredCandidates: number;
    interviewsScheduled: number;
  };
  recentApplications: ApplicationInterface[];
  upcomingInterviews: Schedule[];
  jobStats: JobStat[];
}

