

export interface ApiResponce<T> {
  success: boolean;
  data: T ,
  message?: string;
}

export interface PlainResponce {
  success: boolean,
  message: string
}