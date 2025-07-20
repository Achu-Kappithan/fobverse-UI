import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ApiResponce, PlainResponce } from '../../auth/interfaces/api-responce.interface';
import {
  CandidateInterface,
  CompanyInterface,
  QueryParmsInterface,
} from '../interfaces/company.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminCompanyService {
  private _CompnayState = new BehaviorSubject<CompanyInterface[]>([]);
  company$ = this._CompnayState.asObservable();

  constructor(private readonly http: HttpClient) {}

  getAllCompanies(parms:QueryParmsInterface = {}): Observable<ApiResponce<CompanyInterface[]>> {
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
    return this.http.get<ApiResponce<CompanyInterface[]>>(
      `/api/admin/getallcompany`,
      {params:httpParms, withCredentials: true }
    );
  }

  updateStatus(id:string):Observable<PlainResponce>{
    return this.http.get<PlainResponce>(`/api/admin/company/updatestatus?id=${id}`,{withCredentials : true})
  }

}
