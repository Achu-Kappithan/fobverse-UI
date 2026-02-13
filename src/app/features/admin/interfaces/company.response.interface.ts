

export enum jobType {
  FullTime = 'fulltime',
  PartTime = 'parttime',
  Remote = 'remote',
  OnSite = 'onsite',
}

export interface AllJobsAdminResponse {
  title: string;

  _id: string;

  vacancies: number;

  companyId: string | { _id: string; name: string };

  activeStatus: boolean;

  createdAt: Date;

  jobType: jobType;
}
