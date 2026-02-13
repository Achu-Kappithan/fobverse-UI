import { QualificationLevel } from "../enums/candidate.enum";

export interface CandidateInterface {
  id?: string;

  userId?: string;

  name: string;

  aboutme?:string;

  isActive: boolean;

  profileUrl?: string;

  coverUrl?:string;

  contactInfo?: ContactInfoItem[];

  education?: string[];

  skills?: string[];

  experience?: string[];

  resumeUrl?: string;

  portfolioLinks?: string[];

  createdAt: Date;

  updatedAt: Date;
}

export interface ContactInfoItem {
  type: string;

  value: string;
}

export interface QualificationOption {
  value: QualificationLevel;
  label: string;
}
