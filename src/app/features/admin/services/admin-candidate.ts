import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponce, PlainResponce, QueryParmsInterface } from '../../../shared/interfaces/apiresponce.interface';
import { CandidateInterface } from '../../candidate/interfaces/candidate.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminCandidate {
    constructor(
      private readonly _http: HttpClient
    ) {}
  
    getAllCandidates(parms:QueryParmsInterface): Observable<ApiResponce<CandidateInterface[]>> {

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
      return this._http.get<ApiResponce<CandidateInterface[]>>(
        `/api/admin/getAllcandidates`,
        { params:httpParms, withCredentials: true }
      );
    }

  updateStatus(id:string):Observable<PlainResponce>{
    console.log(id)
    return this._http.get<PlainResponce>(`/api/admin/candidate/updatestatus?id=${id}`,{withCredentials:true})
  }
  
}
