import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiResponce } from '../interfaces/responce.interface';
import { CandidateInterface } from '../interfaces/candidate.interface';
import { CloudinarySignatureResponse } from '../../company/interfaces/cloudinarysignature.responce.interface';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(private readonly http: HttpClient){}

  GetPorfile():Observable<ApiResponce<CandidateInterface>>{
    return this.http.get<ApiResponce<CandidateInterface>>(`api/candidate/getprofile`,{withCredentials:true})
  }

  getCloudinarySignature(params: { folder: string; publicIdPrefix?: string; tags?: string[] }): Observable<ApiResponce<CloudinarySignatureResponse>> {
    return this.http.post<ApiResponce<CloudinarySignatureResponse>>(`/api/cloudinary/sign-upload`, params,{withCredentials: true})
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
      return this.http.post(cloudinaryUploadUrl,formData).pipe(
      tap(res=>{
        console.log("get responce upload file cludinary",res)
      })
      )
  }

  updateProfile(data:CandidateInterface):Observable<ApiResponce<CandidateInterface>>{
    return this.http.post<ApiResponce<CandidateInterface>>('/api/candidate/updataprofile',data,{withCredentials:true})
  }
}
