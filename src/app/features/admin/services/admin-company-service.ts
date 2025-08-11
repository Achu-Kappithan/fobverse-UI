import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, } from 'rxjs';
import { ApiResponce, PagenatedApiResponce, PlainResponce, QueryParmsInterface } from '../../../shared/interfaces/apiresponce.interface';
import { ComapnyProfileInterface, JobsInterface } from '../../company/interfaces/company.responce.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminCompanyService {
  private _CompnayState = new BehaviorSubject<ComapnyProfileInterface[]>([]);
  company$ = this._CompnayState.asObservable();

  constructor(
    private readonly _http: HttpClient
  ) {}

  getAllCompanies(parms:QueryParmsInterface = {}): Observable<ApiResponce<ComapnyProfileInterface[]>> {
    let httpParms = new HttpParams()

    if(parms.limit){
      httpParms = httpParms.set('page',parms.page!.toString())
    }

    if(parms.page){
      httpParms = httpParms.set('limit',parms.limit!.toString())
    }

    if(parms.search){
      httpParms = httpParms.set('search',parms.search)
    }
    return this._http.get<ApiResponce<ComapnyProfileInterface[]>>(
      `/api/admin/getallcompany`,
      {params:httpParms, withCredentials: true }
    );
  }

  updateStatus(id:string):Observable<PlainResponce>{
    return this._http.get<PlainResponce>(`/api/admin/company/updatestatus?id=${id}`,{withCredentials : true})
  }

  getAlljobs(parms:QueryParmsInterface):Observable<PagenatedApiResponce<JobsInterface[]>>{
    let httpParms = new HttpParams

    if(parms.limit){
      httpParms = httpParms.set('limit',parms.limit.toString())
    }
    if(parms.page){
      httpParms = httpParms.set('page',parms.page.toString())
    }
    if(parms.search){
      httpParms = httpParms.set('search',parms.search)
    }

    return this._http.get<PagenatedApiResponce<JobsInterface[]>>(`/api/admin/jobs/getalljobs`,{params:httpParms, withCredentials:true})
  }

  ActivateJobStatus(id:string):Observable<PlainResponce>{
    return this._http.get<PlainResponce>(`/api/admin/jobs/updatejobstatus?id=${id}`,{withCredentials:true})
  }

}
