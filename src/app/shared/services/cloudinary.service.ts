import { Injectable } from '@angular/core';
import { ApiResponse } from '../interfaces/api-response.interface';
import { CloudinarySignatureResponse } from '../interfaces/cloudinary-signature.response.interface';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  constructor(
    private readonly _http:HttpClient
  ){}
  
    getCloudinarySignature(params: { folder: string; publicIdPrefix?: string; tags?: string[] }): Observable<ApiResponse<CloudinarySignatureResponse>> {
      return this._http.post<ApiResponse<CloudinarySignatureResponse>>(`/api/cloudinary/sign-upload`, params)
      .pipe(
        tap(res=>[
          console.log("response get get cludinarySignature",res)
        ])
      )
    }
    
    
    uploadFileToCloudinary(
      file:File,
      signatureData:CloudinarySignatureResponse,
      folder:string,
      publicIdBase:string
    ):Observable<any>{
      console.log("data to upload cloud",file,signatureData,folder,publicIdBase)
        const formData = new FormData()
        formData.append('file', file); 
        formData.append('api_key', signatureData.apiKey);
        formData.append('timestamp', signatureData.timestamp.toString());
        formData.append('signature', signatureData.signature);
        formData.append('folder', folder); 
        formData.append('public_id', signatureData.publicId || `${publicIdBase}_${Date.now()}`);
        const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`
        return this._http.post(cloudinaryUploadUrl,formData).pipe(
        tap(res=>{
          console.log("get response upload file cludinary",res)
        })
        )
    }
  
}
