import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ApplicationInterface, CompanyProfileInterface, CompanyDashboardData, InternalUserInterface, JobsInterface, PopulatedCompanyProfile, populatedJobInterface, TeamMember, UpdateInternalUserInterface } from '../interfaces/company.response.interface';
import { ApiResponse, PaginatedApiResponse, PlainResponse, QueryParmsInterface } from '../../../shared/interfaces/api-response.interface';
import { ApplicationQureryInterface } from '../interfaces/company.interface';
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
    return this._http.get<ApiResponse<CompanyProfileInterface>>(`/api/company/profile`,{withCredentials: true}).pipe(
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
    return this._http.get<ApiResponse<PopulatedCompanyProfile>>(`/api/company/public/profile?id=${id}`)
  }


  updateCompanyProfile(formData:FormData):Observable<ApiResponse<CompanyProfileInterface>>{
    return this._http.patch<ApiResponse<CompanyProfileInterface>>(`/api/company/updateprofile`,formData)
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
    return  this._http.post<ApiResponse<CompanyProfileInterface>>(`/api/company/createuser`,user)
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

    return this._http.get<PaginatedApiResponse<InternalUserInterface[]>>(`/api/company/internalusers`,{ params: httpParms,withCredentials:true})
  }

  getUserProfile():Observable<ApiResponse<InternalUserInterface>>{
    return this._http.get<ApiResponse<InternalUserInterface>>(`/api/company/userprofile`)
  }

  changePassword(currPass:string,newPass:string):Observable<ApiResponse<InternalUserInterface>>{
    return this._http.post<ApiResponse<InternalUserInterface>>('/api/company/updatepassword',{currPass:currPass,newPass:newPass})
  }

  updateUserProfile(dto:UpdateInternalUserInterface):Observable<ApiResponse<InternalUserInterface>>{
    return this._http.post<ApiResponse<InternalUserInterface>>('/api/company/updateuserprofile',dto)
  }

  addTeamMembers(dto:TeamMember):Observable<ApiResponse<CompanyProfileInterface>>{
    return this._http.post<ApiResponse<CompanyProfileInterface>>(`/api/company/addteammember`,dto)
  }

  addJobs(dto:JobsInterface):Observable<ApiResponse<JobsInterface>>{
    return this._http.post<ApiResponse<JobsInterface>>(`/api/jobs/createjob`,dto)
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
    return this._http.get<PaginatedApiResponse<JobsInterface[]>>(`api/jobs/getalljobs`,{params:httpParms, withCredentials:true})
  }

  getJobDetails(id:string):Observable<ApiResponse<JobsInterface>>{
    return this._http.get<ApiResponse<JobsInterface>>(`/api/jobs/jobdetails?id=${id}`)
  }

  getJobPublicView(id:string):Observable<ApiResponse<populatedJobInterface>>{
    return this._http.get<ApiResponse<populatedJobInterface>>(`/api/jobs/publicview?id=${id}`)
  }

  updateJobDetails(id:string,data:JobsInterface):Observable<ApiResponse<JobsInterface>>{
    return this._http.post<ApiResponse<JobsInterface>>(`/api/jobs/updatejob?id=${id}`,data)
  }

  searchLocations(query: string): Observable<string[]> {
  return this._http
    .get<any[]>(`${environment.nominatimUrl}${query}`, { params: { format: 'json' } })
    .pipe(map(res => res.map(item => item.display_name)));
  }


  removeUser(id:string):Observable<PlainResponse>{
    return this._http.delete<PlainResponse>(`/api/company/removeuser?id=${id}`)
  }

  updateNewScore(data:{newScore:number,joId:string}):Observable<ApiResponse<ApplicationInterface[]>>{
    return this._http.patch<ApiResponse<ApplicationInterface[]>>(`/api/applications/updateScore`,data)
  }

  getDashboardData():Observable<ApiResponse<CompanyDashboardData>>{
    return this._http.get<ApiResponse<CompanyDashboardData>>(`/api/company/dashboard`,{withCredentials: true})
  }

}
