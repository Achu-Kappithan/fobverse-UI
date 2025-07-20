

export interface PaginationMeta {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

export interface ApiResponce<T> {
  success: boolean;
  data: T ,
  message?: string;
  meta?: PaginationMeta; 
  timestamp: string;
}



export interface PlainResponce {
  success: boolean,
  message: string
}