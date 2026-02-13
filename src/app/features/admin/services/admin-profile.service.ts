import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/interfaces/api-response.interface';
import { environment } from '../../../../env/environment';
import { ProfileInterface, UpdateAdminProfileInterface } from '../interfaces/admin-profile.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminProfileService {

  constructor(
    private readonly _http: HttpClient
  ) {}

  getUserProfile():Observable<ApiResponse<ProfileInterface>>{
    return this._http.get<ApiResponse<ProfileInterface>>(`${environment.apiUrl}/admin/profile`)
  }

  updateUserProfile(dto:UpdateAdminProfileInterface):Observable<ApiResponse<UpdateAdminProfileInterface>>{
    return this._http.post<ApiResponse<UpdateAdminProfileInterface>>(`${environment.apiUrl}/admin/updateprofile`,dto)
  }

  changePassword(currPass:string,newPass:string):Observable<ApiResponse<ProfileInterface>>{
    return this._http.post<ApiResponse<ProfileInterface>>(`${environment.apiUrl}/admin/updatepassword`,{currPass:currPass,newPass:newPass})
  }
}
