export enum jobType {
  FullTime = 'fulltime',
  PartTmime = 'parttime',
  Remote = 'remote',
  OnSite = 'onsite',
}

export interface AllJobsAdminResponce {
  title: string;

  _id: string;

  vacancies: number;

  companyId: string | { _id: string; name: string };

  activeStatus: boolean;

  createdAt: Date;

  jobType: jobType;
}
