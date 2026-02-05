import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, PlainResponse, QueryParmsInterface } from '../../../shared/interfaces/api-response.interface';
import { CandidateInterface } from '../../candidate/interfaces/candidate.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminCandidate {
    constructor(
      private readonly _http: HttpClient
    ) {}
  
    getAllCandidates(parms:QueryParmsInterface): Observable<ApiResponse<CandidateInterface[]>> {
    let httpParms = new HttpParams();

    if (parms.search) {
      httpParms = httpParms.set('search', parms.search);
    }
    if (parms.page) {
      httpParms = httpParms.set('page', parms.page.toString());
    }
    if (parms.limit) {
      httpParms = httpParms.set('limit', parms.limit.toString());
    }

    return this._http.get<ApiResponse<CandidateInterface[]>>(
      `/api/admin/candidate/getallcandidates`,
      { params: httpParms }
    );
  }

  updateStatus(id:string):Observable<PlainResponse>{
    console.log(id)
    return this._http.get<PlainResponse>(`/api/admin/candidate/updatestatus?id=${id}`)
  }
  
}
