

export interface ApiResponce<T> {
  success: boolean;
  message: string;
  statusCode: number; 
  data?: T;
}

export interface UserPartial { 
  _id: string;
  email: string;
  fullName: string;
  is_verified?: boolean;
  is_superAdmin?: boolean
}

export interface User {
  _id: string;
  email: string;
  fullName: string;
  is_verified: boolean;
  is_superAdmin: boolean

}