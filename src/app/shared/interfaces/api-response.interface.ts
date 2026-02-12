
export interface ApiResponse<T> {
  success: boolean;
  data: T ,
  message: string;
  meta?: PaginationMeta; 
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: {
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
  };
  statusCode: number;
  timestamp: string;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
  timestamp: string;
}

export interface UserPartial { 
  id?: string; // Actual field from auth service
  _id?: string; // Legacy/fallback field
  email: string;
  name: string;
  is_verified?: boolean;
  role: string
  profileImg:string
  
}

export interface User {
  _id: string;
  email: string;
  fullName: string;
  is_verified: boolean;
  is_superAdmin: boolean

}

export type GoogleResponse = Record<string, unknown>;

export interface PlainResponse {
  message: string,
  success:boolean,
}


export interface QueryParmsInterface {
  page?: number
  limit?: number
  search?:string
  filtervalue?: string
}


export interface PaginationMeta {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

