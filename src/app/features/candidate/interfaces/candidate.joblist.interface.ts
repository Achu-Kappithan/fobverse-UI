
export interface jobsPagesAndFilterInterface {
  page?: number;

  limit?: number;

  search?: string;

  jobType?: string[];

  minSalary?: number | null;

  maxSalary?: number | null;

  dueDate?: string | null

}

export enum CandidatejobType {
  FullTime = 'fulltime',
  PartTmime = 'parttime',
  Remote = 'remote',
  OnSite = 'onsite'
}

export interface CandidateJobsInterface {
  _id?:string;

  companyId?:{_id:string ; name: string; logoUrl:string}

  title: string;

  description: string;

  responsibility:string

  jobType:CandidatejobType

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

export interface basicJobDetails {
  _id: string;
  title: string;
  description?: string;
  location?: string;
}