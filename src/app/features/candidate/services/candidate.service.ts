import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CandidateInterface } from '../interfaces/candidate.interface';
import { ApiResponce, PlainResponce } from '../../../shared/interfaces/apiresponce.interface';
import { CandidateJobsInterface, jobApplicationDto, jobsPagesAndFilterInterface } from '../interfaces/candidate.joblist.interface';
import { companyListParamsInterface } from '../interfaces/candidate.companylist.interface';
import { ApplicationsResponse, ApplicationQueryParams } from '../interfaces/candidate.application.interface';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(private readonly _http: HttpClient){}

  GetPorfile():Observable<ApiResponce<CandidateInterface>>{
    return this._http.get<ApiResponce<CandidateInterface>>(`api/candidate/getprofile`)
  }

  getPublicView(id:string):Observable<ApiResponce<CandidateInterface>>{
    return this._http.get<ApiResponce<CandidateInterface>>(`/api/candidate/public/profile?id=${id}`)
  }

  updateProfile(data:CandidateInterface):Observable<ApiResponce<CandidateInterface>>{
    return this._http.post<ApiResponce<CandidateInterface>>('/api/candidate/updataprofile',data)
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
    return this._http.get<ApiResponce<CandidateJobsInterface[]>>(`/api/jobs/getalljobs`, { params: httpParams });
  }

    updateResume(filename:string):Observable<ApiResponce<CandidateInterface>>{
    return this._http.post<ApiResponce<CandidateInterface>>('/api/candidate/updataprofile',{resumeUrl:filename})
  }

  applayJob(id:string,data:jobApplicationDto):Observable<PlainResponce>{
    console.log(data)
    return this._http.post<PlainResponce>(`/api/applications/applyjob?id=${id}`,data)
  }

  getAllCompanies(
    params: companyListParamsInterface,
  ): Observable<any> {
    let httpParams = new HttpParams();

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }

    return this._http.get<any>(
      '/api/candidate/all-companies',
      { params: httpParams },
    );
  }

  getMyApplications(params: ApplicationQueryParams): Observable<ApplicationsResponse> {
    let httpParams = new HttpParams();

    if (params.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.stage) {
      httpParams = httpParams.set('stage', params.stage);
    }

    return this._http.get<ApplicationsResponse>(
      '/api/candidate/my-applications',
      { params: httpParams }
    );
  }
}
