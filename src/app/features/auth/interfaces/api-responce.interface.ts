

export interface ApiResponce<T> {
  success: boolean;
  data: T | null;
  message?: string;
}