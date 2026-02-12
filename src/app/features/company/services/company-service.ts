import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ApplicationInterface, CompanyProfileInterface, CompanyDashboardData, InternalUserInterface, JobsInterface, PopulatedCompanyProfile, populatedJobInterface, TeamMember, UpdateInternalUserInterface } from '../interfaces/company.response.interface';
import { ApiResponse, PaginatedApiResponse, PlainResponse, QueryParmsInterface } from '../../../shared/interfaces/api-response.interface';

import { environment } from '../../../../env/environment';
import { LoggerService } from '../../../shared/services/logger/logger.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  public CompanyProfileSubject = new BehaviorSubject<CompanyProfileInterface | null>(null)
  companyProfile$ = this.CompanyProfileSubject.asObservable()

  constructor(
    private readonly _http: HttpClient,
    private readonly _logger: LoggerService
  ){}


  getCompanyProfile():Observable<ApiResponse<CompanyProfileInterface>>{
    return this._http.get<ApiResponse<CompanyProfileInterface>>(`${environment.apiUrl}/company/profile`,{withCredentials: true}).pipe(
      tap(res =>{
        if(res && res.success){
          this.CompanyProfileSubject.next(res.data!)
        }else{
          this.CompanyProfileSubject.next(null)
          this._logger.warn("failed to add get company details")
        }
      }),
    )
  }

  getPublicView(id:string):Observable<ApiResponse<PopulatedCompanyProfile>>{
    return this._http.get<ApiResponse<PopulatedCompanyProfile>>(`${environment.apiUrl}/company/public/profile?id=${id}`)
  }


  updateCompanyProfile(formData:FormData):Observable<ApiResponse<CompanyProfileInterface>>{
    return this._http.patch<ApiResponse<CompanyProfileInterface>>(`${environment.apiUrl}/company/updateprofile`,formData)
    .pipe(
      tap(res =>{
        if(res.success){
          this._logger.info("Updated Response",res.data)
          this.CompanyProfileSubject.next(res.data!)
        }else{
          this._logger.error("error for updating profile info",res)
        }
      })
    )
  }

  createUser(user:InternalUserInterface):Observable<ApiResponse<CompanyProfileInterface>>{
    return  this._http.post<ApiResponse<CompanyProfileInterface>>(`${environment.apiUrl}/company/createuser`,user)
  }

  getInternalUsers(params:QueryParmsInterface):Observable<PaginatedApiResponse<InternalUserInterface[]>>{
    let  httpParms = new HttpParams
    
    if(params.limit){
       httpParms = httpParms.set('limit',params.limit.toString())
    }
    if(params.page){
      httpParms = httpParms.set('page',params.page.toString())
    }
    if(params.search){
      httpParms = httpParms.set('search',params.search)
    }
    if(params.filtervalue){
      httpParms = httpParms.set('filtervalue',params.filtervalue)
    }

    return this._http.get<PaginatedApiResponse<InternalUserInterface[]>>(`${environment.apiUrl}/company/internalusers`,{ params: httpParms,withCredentials:true})
  }

  getUserProfile():Observable<ApiResponse<InternalUserInterface>>{
    return this._http.get<ApiResponse<InternalUserInterface>>(`${environment.apiUrl}/company/userprofile`)
  }

  changePassword(currPass:string,newPass:string):Observable<ApiResponse<InternalUserInterface>>{
    return this._http.post<ApiResponse<InternalUserInterface>>(`${environment.apiUrl}/company/updatepassword`,{currPass:currPass,newPass:newPass})
  }

  updateUserProfile(dto:UpdateInternalUserInterface):Observable<ApiResponse<InternalUserInterface>>{
    return this._http.post<ApiResponse<InternalUserInterface>>(`${environment.apiUrl}/company/updateuserprofile`,dto)
  }

  addTeamMembers(dto:TeamMember):Observable<ApiResponse<CompanyProfileInterface>>{
    return this._http.post<ApiResponse<CompanyProfileInterface>>(`${environment.apiUrl}/company/addteammember`,dto)
  }

  addJobs(dto:JobsInterface):Observable<ApiResponse<JobsInterface>>{
    return this._http.post<ApiResponse<JobsInterface>>(`${environment.apiUrl}/jobs/createjob`,dto)
  }

  getAllJobs(params:QueryParmsInterface):Observable<PaginatedApiResponse<JobsInterface[]>>{
    let httpParms = new HttpParams

    if(params.limit){
      httpParms = httpParms.set('limit',params.limit.toString())
    }
    if(params.page){
      httpParms = httpParms.set('page',params.page.toString())
    }
    if(params.search){
      httpParms = httpParms.set('search',params.search)
    }
    return this._http.get<PaginatedApiResponse<JobsInterface[]>>(`${environment.apiUrl}/jobs/getalljobs`,{params:httpParms, withCredentials:true})
  }

  getJobDetails(id:string):Observable<ApiResponse<JobsInterface>>{
    return this._http.get<ApiResponse<JobsInterface>>(`${environment.apiUrl}/jobs/jobdetails?id=${id}`)
  }

  getJobPublicView(id:string):Observable<ApiResponse<populatedJobInterface>>{
    return this._http.get<ApiResponse<populatedJobInterface>>(`${environment.apiUrl}/jobs/publicview?id=${id}`)
  }

  updateJobDetails(id:string,data:JobsInterface):Observable<ApiResponse<JobsInterface>>{
    return this._http.post<ApiResponse<JobsInterface>>(`${environment.apiUrl}/jobs/updatejob?id=${id}`,data)
  }

  searchLocations(query: string): Observable<string[]> {
  return this._http
    .get<Record<string, unknown>[]>(`${environment.nominatimUrl}${query}`, { params: { format: 'json' } })
    .pipe(map(res => res.map(item => (item as Record<string, unknown>)['display_name'] as string)));
  }


  removeUser(id:string):Observable<PlainResponse>{
    return this._http.delete<PlainResponse>(`${environment.apiUrl}/company/removeuser?id=${id}`)
  }

  updateNewScore(data:{newScore:number,joId:string}):Observable<ApiResponse<ApplicationInterface[]>>{
    return this._http.patch<ApiResponse<ApplicationInterface[]>>(`${environment.apiUrl}/applications/updateScore`,data)
  }

  getDashboardData():Observable<ApiResponse<CompanyDashboardData>>{
    return this._http.get<ApiResponse<CompanyDashboardData>>(`${environment.apiUrl}/company/dashboard`,{withCredentials: true})
  }

}
