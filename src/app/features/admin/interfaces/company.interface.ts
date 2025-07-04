

export  interface CompanyInterface {
  _id: string;

  userId: string;

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





