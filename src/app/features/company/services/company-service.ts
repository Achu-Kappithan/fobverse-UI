import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { ApiResponce, ComapnyProfileInterface, InternalUser } from '../interfaces/company.responce.interface';
import { CloudinarySignatureResponse } from '../interfaces/cloudinarysignature.responce.interface';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  public ComapnySubject = new BehaviorSubject<ComapnyProfileInterface | null>(null)
  company$ = this.ComapnySubject.asObservable()

  constructor(
    private readonly http: HttpClient
  ){}


  getProfile():Observable<ApiResponce<ComapnyProfileInterface>>{
    return this.http.get<ApiResponce<ComapnyProfileInterface>>(`/api/company/profile`,{withCredentials: true}).pipe(
      tap(res =>{
        if(res && res.success){
          this.ComapnySubject.next(res.data)
        }else{
          this.ComapnySubject.next(null)
          console.log("faild to add get company details")
        }
      }),
    )
  }


  updateProfile(formData:FormData):Observable<ApiResponce<ComapnyProfileInterface>>{
    return this.http.patch<ApiResponce<ComapnyProfileInterface>>(`/api/company/updateprofile`,formData,{withCredentials:true})
    .pipe(
      tap(res =>{
        if(res.success){
          console.log("Updated Responce",res.data)
          this.ComapnySubject.next(res.data)
        }else{
          console.log("error for updating profile info",res)
        }
      })
    )
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
    console.log("dat to upload cloud",file,signatureData,folder,publicIdBase)
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


  createUser(user:InternalUser):Observable<ApiResponce<ComapnyProfileInterface>>{
    return  this.http.post<ApiResponce<ComapnyProfileInterface>>(`/api/company/createuser`,user,{withCredentials:true})
    .pipe(
      tap(res =>{
        if(res.success){
          this.ComapnySubject.next(res.data)
        }
      })
    )
  }
}
