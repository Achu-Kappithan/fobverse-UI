import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoggerService } from '../../../shared/services/logger/logger.service';
import { Observable } from 'rxjs';
import { CandidateInterface } from '../interfaces/candidate.interface';
import { ApiResponse, PaginatedResponse, PlainResponse } from '../../../shared/interfaces/api-response.interface';
import { CandidateJobsInterface, jobApplicationDto, jobsPagesAndFilterInterface } from '../interfaces/candidate.joblist.interface';
import {
  CompanyProfileInterface,
  companyListParamsInterface,
} from '../interfaces/candidate.companylist.interface';
import { ApplicationQueryParams, CandidateApplication, DetailedApplicationResponse } from '../interfaces/candidate.application.interface';
import { environment } from '../../../../env/environment';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  private readonly _logger = inject(LoggerService);
  constructor(private readonly _http: HttpClient){}

  GetPorfile():Observable<ApiResponse<CandidateInterface>>{
    return this._http.get<ApiResponse<CandidateInterface>>(`${environment.apiUrl}/candidate/getprofile`)
  }

  getPublicView(id:string):Observable<ApiResponse<CandidateInterface>>{
    return this._http.get<ApiResponse<CandidateInterface>>(`${environment.apiUrl}/candidate/public/profile?id=${id}`)
  }

  updateProfile(data:CandidateInterface):Observable<ApiResponse<CandidateInterface>>{
    return this._http.post<ApiResponse<CandidateInterface>>(`${environment.apiUrl}/candidate/updateprofile`,data)
  }

  getAlljobs(params: jobsPagesAndFilterInterface): Observable<ApiResponse<CandidateJobsInterface[]>> {
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
    return this._http.get<ApiResponse<CandidateJobsInterface[]>>(`${environment.apiUrl}/jobs/getalljobs`, { params: httpParams });
  }


  updateResume(filename:string):Observable<ApiResponse<CandidateInterface>>{
    return this._http.post<ApiResponse<CandidateInterface>>(`${environment.apiUrl}/candidate/updataprofile`, { resumeUrl: filename })
  }

  applayJob(id:string,data:jobApplicationDto):Observable<PlainResponse>{
    this._logger.log('Applying for job:', data);
    return this._http.post<PlainResponse>(`${environment.apiUrl}/applications/applyjob?id=${id}`,data)
  }

  getAllCompanies(
    params: companyListParamsInterface,
  ): Observable<PaginatedResponse<CompanyProfileInterface[]>> {
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

    return this._http.get<PaginatedResponse<CompanyProfileInterface[]>>(
      '/api/candidate/all-companies',
      { params: httpParams },
    );
  }

  getPublicCompanies(params: companyListParamsInterface): Observable<PaginatedResponse<CompanyProfileInterface[]>> {
    let httpParams = new HttpParams();
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());

    return this._http.get<PaginatedResponse<CompanyProfileInterface[]>>(
      '/api/candidate/all-companies',
      { params: httpParams },
    );
  }

  getMyApplications(params: ApplicationQueryParams): Observable<PaginatedResponse<CandidateApplication[]>> {
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
      httpParams = httpParams.set('filtervalue', params.stage);
    }

    return this._http.get<PaginatedResponse<CandidateApplication[]>>(
      `${environment.apiUrl}/candidate/my-applications`,
      { params: httpParams }
    );
  }

  getAllStages(applicationId: string): Observable<ApiResponse<any>> {
    return this._http.get<ApiResponse<any>>(
      `${environment.apiUrl}/interview/all-stages`,
      { params: { applicationId: applicationId } }
    );
  }

  getApplicationDetails(applicationId: string): Observable<ApiResponse<DetailedApplicationResponse>> {
    return this._http.get<ApiResponse<DetailedApplicationResponse>>(
      `${environment.apiUrl}/candidate/application-details/${applicationId}`
    );
  }

  getHomeDataPublic(): Observable<ApiResponse<{ jobs: CandidateJobsInterface[]; companies: CompanyProfileInterface[] }>> {
    return this._http.get<ApiResponse<{ jobs: CandidateJobsInterface[]; companies: CompanyProfileInterface[] }>>(
      `${environment.apiUrl}/candidate/home-data-public`
    );
  }

  changePassword(currPass: string, newPass: string): Observable<ApiResponse<CandidateInterface>> {
    return this._http.post<ApiResponse<CandidateInterface>>(`${environment.apiUrl}/candidate/change-pwd`, { currPass, newPass });
  }
}

