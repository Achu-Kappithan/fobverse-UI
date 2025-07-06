

export interface ApiResponce<T> {
  success: boolean;
  data: T ,
  message?: string;
}