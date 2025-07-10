

export interface ComapnyProfile {
  _id: string;

  userId: string;

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

export interface ApiResponce<T>{
    message:string,
    success:string,
    data:T
}