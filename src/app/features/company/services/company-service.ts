import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ApplicationInterface, ComapnyProfileInterface, InternalUserInterface, JobsInterface, populatecompanyProfile, TeamMember, UpdateInternalUserInterface } from '../interfaces/company.responce.interface';
import { ApiResponce, PagenatedApiResponce, QueryParmsInterface } from '../../../shared/interfaces/apiresponce.interface';
import { ApplicationQureryInterface } from '../interfaces/company.interface';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  public ComapnyProfileSubject = new BehaviorSubject<ComapnyProfileInterface | null>(null)
  companyProfile$ = this.ComapnyProfileSubject.asObservable()

  private readonly NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search?format=json&limit=5&q='

  constructor(
    private readonly _http: HttpClient
  ){}


  getCompanyProfile():Observable<ApiResponce<ComapnyProfileInterface>>{
    return this._http.get<ApiResponce<ComapnyProfileInterface>>(`/api/company/profile`,{withCredentials: true}).pipe(
      tap(res =>{
        if(res && res.success){
          this.ComapnyProfileSubject.next(res.data!)
        }else{
          this.ComapnyProfileSubject.next(null)
          console.log("faild to add get company details")
        }
      }),
    )
  }

  getPublicView(id:string):Observable<ApiResponce<populatecompanyProfile>>{
    return this._http.get<ApiResponce<populatecompanyProfile>>(`/api/company/public/profile?id=${id}`)
  }


  updateCompanyProfile(formData:FormData):Observable<ApiResponce<ComapnyProfileInterface>>{
    return this._http.patch<ApiResponce<ComapnyProfileInterface>>(`/api/company/updateprofile`,formData)
    .pipe(
      tap(res =>{
        if(res.success){
          console.log("Updated Responce",res.data)
          this.ComapnyProfileSubject.next(res.data!)
        }else{
          console.log("error for updating profile info",res)
        }
      })
    )
  }

  createUser(user:InternalUserInterface):Observable<ApiResponce<ComapnyProfileInterface>>{
    return  this._http.post<ApiResponce<ComapnyProfileInterface>>(`/api/company/createuser`,user)
  }

  getInternalUsers(params:QueryParmsInterface):Observable<PagenatedApiResponce<InternalUserInterface[]>>{
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

    return this._http.get<PagenatedApiResponce<InternalUserInterface[]>>(`/api/company/internalusers`,{ params: httpParms,withCredentials:true})
  }

  getUserProfile():Observable<ApiResponce<InternalUserInterface>>{
    return this._http.get<ApiResponce<InternalUserInterface>>(`/api/company/userprofile`)
  }

  changePassword(currPass:string,newPass:string):Observable<ApiResponce<InternalUserInterface>>{
    return this._http.post<ApiResponce<InternalUserInterface>>('/api/company/updatepassword',{currPass:currPass,newPass:newPass})
  }

  updateUserProfile(dto:UpdateInternalUserInterface):Observable<ApiResponce<InternalUserInterface>>{
    return this._http.post<ApiResponce<InternalUserInterface>>('/api/company/updateuserprofile',dto)
  }

  addTeamMembers(dto:TeamMember):Observable<ApiResponce<ComapnyProfileInterface>>{
    return this._http.post<ApiResponce<ComapnyProfileInterface>>(`/api/company/addteammember`,dto)
  }

  addJobs(dto:JobsInterface):Observable<ApiResponce<JobsInterface>>{
    return this._http.post<ApiResponce<JobsInterface>>(`/api/jobs/createjob`,dto)
  }

  getAllJobs(params:QueryParmsInterface):Observable<PagenatedApiResponce<JobsInterface[]>>{
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
    return this._http.get<PagenatedApiResponce<JobsInterface[]>>(`api/jobs/getalljobs`,{params:httpParms, withCredentials:true})
  }

  getJobDetails(id:string):Observable<ApiResponce<JobsInterface>>{
    return this._http.get<ApiResponce<JobsInterface>>(`/api/jobs/jobdetails?id=${id}`)
  }

  getJobPublicView(id:string):Observable<ApiResponce<JobsInterface>>{
    return this._http.get<ApiResponce<JobsInterface>>(`/api/jobs/jobdetails?id=${id}`)
  }

  updateJobDetails(id:string,data:JobsInterface):Observable<ApiResponce<JobsInterface>>{
    return this._http.post<ApiResponce<JobsInterface>>(`/api/jobs/updatejob?id=${id}`,data)
  }

  searchLocations(query: string): Observable<string[]> {
  return this._http
    .get<any[]>(`${this.NOMINATIM_URL}${query}`, { params: { format: 'json' } })
    .pipe(map(res => res.map(item => item.display_name)));
  }

  getAllApplication(params:ApplicationQureryInterface):Observable<ApiResponce<ApplicationInterface[]>>{
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
    if(params.filtervalue){
      httpParms = httpParms.set('filtervalue',params.filtervalue)
    }
    if(!params.jobId){
     throw new  Error('jobId  Required')
    }
    httpParms = httpParms.set('jobId',params.jobId)
    return this._http.get<ApiResponce<ApplicationInterface[]>>(`/api/applications/applicants`,{params:httpParms})
  }

}
