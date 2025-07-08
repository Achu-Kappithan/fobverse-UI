

export  interface CompanyInterface {
  _id:string

  userId:string

  name: string;

  industry?: string;

  contactInfo?: string[];

  officeLocation?: string[];

  techStack?: string[];

  location?: string;

  logoUrl?: string;

  description?: string;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;

}


export interface ContactInfoInterface {
  phoneNumber?: string;

  address?: string;

  linkedIn?: string;

  github?: string;
}

export interface CandidateInterface {
  id: string;

  userId: string;

  name: string;

  isActive: boolean;

  profileUrl?: string;

  contactInfo?: ContactInfoInterface;

  education?: string[];

  skills?: string[];

  experience?: string[];

  resumeUrl?: string;

  portfolioLinks?: string;

  createdAt: Date;

  updatedAt: Date;
}






