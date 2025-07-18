

export interface InternalUser {
  name: string;

  email: string;

  role: string;

  profileImg?: string;

  password: string;
}

export interface TeamMember {
  name: string;

  role: string;

  image: string;
}

export interface CompanyContactInfoItem {
  type: string;

  value: string;
}



export  interface CompanyInterface {
  _id: string;

  userId: string;

  name: string;

  industry?: string;

  contactInfo?: CompanyContactInfoItem[];

  officeLocation?: string[];

  techStack?: string[];

  imageGallery?:string[]

  logoUrl?: string;

  description?: string;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;

  teamMembers?: TeamMember[];

  internalUsers?: InternalUser[];

  benafits?:string[]

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






