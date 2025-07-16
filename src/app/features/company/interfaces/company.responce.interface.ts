


export interface ApiResponce<T>{
    message:string,
    success:string,
    data:T
}



export interface InternalUser {
  name: string;

  email: string;

  role: string;

  profilePic?: string;

  password: string;
}

export interface ContactInfoItem {
  type: string;

  value: string;
}

export interface TeamMember {
  name: string;

  role: string;

  image: string;
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
