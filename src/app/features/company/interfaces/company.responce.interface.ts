


export interface InternalUserInterface {
  id:string
  
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

export interface ComapnyProfileInterface {
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

  benafits?:string[]
}

export enum jobType {
  FullTime = 'fulltime',
  PartTmime = 'parttime',
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

  qualification: string;

  experience: string;

  resumeUrl: string;

}
