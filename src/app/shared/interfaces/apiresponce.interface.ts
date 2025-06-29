

export interface ApiResponce<T> {
  success: boolean;
  message?: string;
  data: T| null
}

export interface UserPartial { 
  _id?: string;
  email: string;
  fullName: string;
  is_verified?: boolean;
  is_superAdmin?: boolean;
  role: string
}

export interface User {
  _id: string;
  email: string;
  fullName: string;
  is_verified: boolean;
  is_superAdmin: boolean

}

export interface GoogleResponce {
  
}

