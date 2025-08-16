import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponce } from '../../../shared/interfaces/apiresponce.interface';
import { ProfileInterface, UpdateAdminProfileInterface } from '../interfaces/admin-profile.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminProfileService {
  
  constructor(
    private readonly _http: HttpClient
  ) {}

  getUserProfile():Observable<ApiResponce<ProfileInterface>>{
    return this._http.get<ApiResponce<ProfileInterface>>(`/api/admin/profile`,{withCredentials:true})
  }

  updateUserProfile(dto:UpdateAdminProfileInterface):Observable<ApiResponce<UpdateAdminProfileInterface>>{
    return this._http.post<ApiResponce<UpdateAdminProfileInterface>>('/api/admin/updateprofile',dto,{withCredentials:true})
  }

  changePassword(currPass:string,newPass:string):Observable<ApiResponce<ProfileInterface>>{
    return this._http.post<ApiResponce<ProfileInterface>>('/api/admin/updatepassword',{currPass:currPass,newPass:newPass},{withCredentials:true})
  }
}
