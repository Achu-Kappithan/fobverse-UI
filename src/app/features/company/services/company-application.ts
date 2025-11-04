import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationQureryInterface } from '../interfaces/company.interface';
import { Observable } from 'rxjs';
import { ApiResponce } from '../../../shared/interfaces/apiresponce.interface';
import { ApplicationInterface, applicationWithProfile } from '../interfaces/company.responce.interface';

@Injectable({
  providedIn: 'root'
})
export class CompanyApplication {

  constructor(
    private readonly _http:HttpClient
  ){}
  

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

  getApplicationDetails(appId:string,canId:string):Observable<ApiResponce<applicationWithProfile>>{
    return this._http.get<ApiResponce<applicationWithProfile>>(`/api/applications/applicationDetails/${appId}/${canId}`)
  }
}
