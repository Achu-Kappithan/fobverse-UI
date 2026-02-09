import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LoggerService } from '../../../shared/services/logger/logger.service';
import { Observable } from 'rxjs';
import { ApiResponse, PlainResponse, QueryParmsInterface } from '../../../shared/interfaces/api-response.interface';
import { CandidateInterface } from '../../candidate/interfaces/candidate.interface';
import { environment } from '../../../../env/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminCandidate {
    constructor(
      private readonly _http: HttpClient
    ) {}
    private readonly _logger = inject(LoggerService);
  
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
      `${environment.apiUrl}/admin/candidate/getallcandidates`,
      { params: httpParms }
    );
  }

  updateStatus(id:string):Observable<PlainResponse>{
    this._logger.log('Updating candidate status:', id);
    return this._http.get<PlainResponse>(`${environment.apiUrl}/admin/candidate/updatestatus?id=${id}`)
  }
  
}
