import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { ComapnyProfileInterface, InternalUserInterface, JobsInterface, TeamMember, UpdateInternalUserInterface } from '../interfaces/company.responce.interface';
import { ApiResponce, PagenatedApiResponce, QueryParmsInterface } from '../../../shared/interfaces/apiresponce.interface';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  public ComapnyProfileSubject = new BehaviorSubject<ComapnyProfileInterface | null>(null)
  companyProfile$ = this.ComapnyProfileSubject.asObservable()

  constructor(
    private readonly http: HttpClient
  ){}


  getCompanyProfile():Observable<ApiResponce<ComapnyProfileInterface>>{
    return this.http.get<ApiResponce<ComapnyProfileInterface>>(`/api/company/profile`,{withCredentials: true}).pipe(
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


  updateCompanyProfile(formData:FormData):Observable<ApiResponce<ComapnyProfileInterface>>{
    return this.http.patch<ApiResponce<ComapnyProfileInterface>>(`/api/company/updateprofile`,formData,{withCredentials:true})
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
    return  this.http.post<ApiResponce<ComapnyProfileInterface>>(`/api/company/createuser`,user,{withCredentials:true})
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

    return this.http.get<PagenatedApiResponce<InternalUserInterface[]>>(`/api/company/internalusers`,{ params: httpParms,withCredentials:true})
  }

  getUserProfile():Observable<ApiResponce<InternalUserInterface>>{
    return this.http.get<ApiResponce<InternalUserInterface>>(`/api/company/userprofile`,{withCredentials:true})
  }

  changePassword(currPass:string,newPass:string):Observable<ApiResponce<InternalUserInterface>>{
    return this.http.post<ApiResponce<InternalUserInterface>>('/api/company/updatepassword',{currPass:currPass,newPass:newPass},{withCredentials:true})
  }

  updateUserProfile(dto:UpdateInternalUserInterface):Observable<ApiResponce<InternalUserInterface>>{
    return this.http.post<ApiResponce<InternalUserInterface>>('/api/company/updateuserprofile',dto,{withCredentials:true})
  }

  addTeamMembers(dto:TeamMember):Observable<ApiResponce<ComapnyProfileInterface>>{
    return this.http.post<ApiResponce<ComapnyProfileInterface>>(`/api/company/addteammember`,dto,{withCredentials:true})
  }

  addJobs(dto:JobsInterface):Observable<ApiResponce<JobsInterface>>{
    return this.http.post<ApiResponce<JobsInterface>>(`/api/jobs/createjob`,dto,{withCredentials:true})
  }

  getAllJobs(params:QueryParmsInterface):Observable<PagenatedApiResponce<JobsInterface[]>>{
    console.log(params)
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
    console.log("before making http call")
    return this.http.get<PagenatedApiResponce<JobsInterface[]>>(`api/jobs/getalljobs`,{params:httpParms, withCredentials:true})
  }

}
