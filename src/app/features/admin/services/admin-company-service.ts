import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, } from 'rxjs';
import { ApiResponse, PaginatedApiResponse, PlainResponse, QueryParmsInterface } from '../../../shared/interfaces/api-response.interface';
import { CompanyProfileInterface, JobsInterface } from '../../company/interfaces/company.response.interface';
import { AllJobsAdminResponse } from '../interfaces/company.response.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminCompanyService {
  private _CompanyState = new BehaviorSubject<CompanyProfileInterface[]>([]);
  company$ = this._CompanyState.asObservable();

  constructor(
    private readonly _http: HttpClient
  ) {}

  getAllCompanies(parms:QueryParmsInterface = {}): Observable<ApiResponse<CompanyProfileInterface[]>> {
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
    return this._http.get<ApiResponse<CompanyProfileInterface[]>>(
      `/api/admin/getallcompany`,
      {params:httpParms, withCredentials: true }
    );
  }

  updateStatus(id:string):Observable<PlainResponse>{
    return this._http.get<PlainResponse>(`/api/admin/company/updatestatus?id=${id}`,{withCredentials : true})
  }

  getAlljobs(parms:QueryParmsInterface):Observable<PaginatedApiResponse<AllJobsAdminResponse[]>>{
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

    return this._http.get<PaginatedApiResponse<AllJobsAdminResponse[]>>(`/api/admin/jobs/getalljobs`,{params:httpParms, withCredentials:true})
  }

  ActivateJobStatus(id:string):Observable<PlainResponse>{
    return this._http.get<PlainResponse>(`/api/admin/jobs/updatejobstatus?id=${id}`)
  }

}
