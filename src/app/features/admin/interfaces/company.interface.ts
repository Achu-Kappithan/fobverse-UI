

export  interface CompanyInterface {
  _id:{ buffer: any }

  userId: { buffer: any }

  companyName: string;

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





