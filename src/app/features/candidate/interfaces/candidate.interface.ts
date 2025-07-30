
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

  coverUrl?:string;

  contactInfo?: ContactInfoInterface;

  education?: string[];

  skills?: string[];

  experience?: string[];

  resumeUrl?: string;

  portfolioLinks?: string;

  createdAt: Date;

  updatedAt: Date;
}
