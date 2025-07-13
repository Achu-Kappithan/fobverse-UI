

export interface CloudinarySignatureResponse {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  publicId?: string; 
}

export interface GalleryImageDisplay {
  url: string | ArrayBuffer | null; 
  file: File | null; 
  publicId: string | null; 
  isNew: boolean; 
}