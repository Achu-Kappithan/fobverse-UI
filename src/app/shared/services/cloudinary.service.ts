import { Injectable } from '@angular/core';
import { ApiResponce } from '../interfaces/apiresponce.interface';
import { CloudinarySignatureResponse } from '../interfaces/cloudinarysignature.responce.interface';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  constructor(
    private readonly _http:HttpClient
  ){}
  
    getCloudinarySignature(params: { folder: string; publicIdPrefix?: string; tags?: string[] }): Observable<ApiResponce<CloudinarySignatureResponse>> {
      return this._http.post<ApiResponce<CloudinarySignatureResponse>>(`/api/cloudinary/sign-upload`, params,{withCredentials: true})
      .pipe(
        tap(res=>[
          console.log("responce get get cludinarySignature",res)
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
          console.log("get responce upload file cludinary",res)
        })
        )
    }
  
}
