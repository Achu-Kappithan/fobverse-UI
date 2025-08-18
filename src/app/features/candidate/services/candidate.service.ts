import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CandidateInterface } from '../interfaces/candidate.interface';
import { ApiResponce } from '../../../shared/interfaces/apiresponce.interface';
import { CandidateJobsInterface, jobsPagesAndFilterInterface } from '../interfaces/candidate.joblist.interface';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(private readonly _http: HttpClient){}

  GetPorfile():Observable<ApiResponce<CandidateInterface>>{
    return this._http.get<ApiResponce<CandidateInterface>>(`api/candidate/getprofile`,{withCredentials:true})
  }

  getPublicView():Observable<ApiResponce<CandidateInterface>>{
    return this._http.get<ApiResponce<CandidateInterface>>(`/api/cadidate/public/profile`,{withCredentials:true})
  }

  updateProfile(data:CandidateInterface):Observable<ApiResponce<CandidateInterface>>{
    return this._http.post<ApiResponce<CandidateInterface>>('/api/candidate/updataprofile',data,{withCredentials:true})
  }

  getAlljobs(params: jobsPagesAndFilterInterface): Observable<ApiResponce<CandidateJobsInterface[]>> {
    let httpParams = new HttpParams();

    if(params.search){
      httpParams = httpParams.set('search',params.search)
    }

    if (params.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }

    if (params.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }

    if (params.jobType && params.jobType.length > 0) {
      params.jobType.forEach(type => {
        httpParams = httpParams.append('jobType', type); 
      });
    }

    if (params.minSalary !== null && params.minSalary !== undefined) {
      httpParams = httpParams.set('minSalary', params.minSalary.toString());
    }

    if (params.maxSalary !== null && params.maxSalary !== undefined) {
      httpParams = httpParams.set('maxSalary', params.maxSalary.toString());
    }

    if (params.dueDate) {
      httpParams = httpParams.set('dueDate', params.dueDate); 
    }
    return this._http.get<ApiResponce<CandidateJobsInterface[]>>(`/api/jobs/getalljobs`, { params: httpParams, withCredentials: true });
  }
}
