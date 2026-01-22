import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ApplicationQureryInterface,
  CancelInterviewInterface,
} from '../interfaces/company.interface';
import { Observable } from 'rxjs';
import { ApiResponce } from '../../../shared/interfaces/apiresponce.interface';
import {
  ApplicationInterface,
  applicationWithProfile,
  InternalUserInterface,
  PaginatedResponse,
} from '../interfaces/company.responce.interface';
import {
  SheduleInterface,
  SheduleResponceInterface,
  updatefeedbackInterface,
  FinalizeResultInterface,
} from '../interfaces/company.interviewresponce.interface';

@Injectable({
  providedIn: 'root',
})
export class CompanyApplication {
  constructor(private readonly _http: HttpClient) {}

  getAllApplication(
    params: ApplicationQureryInterface
  ): Observable<ApiResponce<ApplicationInterface[]>> {
    let httpParms = new HttpParams();

    if (params.limit) {
      httpParms = httpParms.set('limit', params.limit.toString());
    }
    if (params.page) {
      httpParms = httpParms.set('page', params.page.toString());
    }
    if (params.search) {
      httpParms = httpParms.set('search', params.search);
    }
    if (params.filtervalue) {
      httpParms = httpParms.set('filtervalue', params.filtervalue);
    }
    if (!params.jobId) {
      throw new Error('jobId  Required');
    }
    httpParms = httpParms.set('jobId', params.jobId);
    return this._http.get<ApiResponce<ApplicationInterface[]>>(
      `/api/applications/applicants`,
      { params: httpParms }
    );
  }

  getApplicationDetails(
    appId: string,
    canId: string
  ): Observable<ApiResponce<applicationWithProfile>> {
    return this._http.get<ApiResponce<applicationWithProfile>>(
      `/api/applications/applicationDetails/${appId}/${canId}`
    );
  }

  getHrlist(): Observable<ApiResponce<InternalUserInterface[]>> {
    return this._http.get<ApiResponce<InternalUserInterface[]>>(
      `/api/company/hrusers`
    );
  }

  getInterviewers(): Observable<ApiResponce<InternalUserInterface[]>> {
    return this._http.get<ApiResponce<InternalUserInterface[]>>(
      `/api/company/interviewers`
    );
  }

  sheduleInterview(
    data: SheduleInterface
  ): Observable<ApiResponce<SheduleResponceInterface>> {
    console.log('data  for  sheduling interivew',data)
    return this._http.post<ApiResponce<SheduleResponceInterface>>(
      `/api/interview/shedule`,
      data
    );
  }

  sheduleTelyInterview(
    data: SheduleInterface
  ): Observable<ApiResponce<SheduleResponceInterface>> {
    console.log('data  for  sheduling interivew',data)
    return this._http.post<ApiResponce<SheduleResponceInterface>>(
      `/api/interview/telephone/shedule`,
      data
    );
  }

  getStageDetails(
    applicationId: string,
    stage: string
  ): Observable<ApiResponce<SheduleResponceInterface>> {
    return this._http.get<ApiResponce<SheduleResponceInterface>>(
      `/api/interview/getstagedetails`,
      { params: { applicationId: applicationId, stage: stage } }
    );
  }

  updateFeedback(
    data: updatefeedbackInterface
  ): Observable<ApiResponce<SheduleResponceInterface>> {
    console.log('updatting feedbak data', data);
    return this._http.post<ApiResponce<SheduleResponceInterface>>(
      `/api/interview/updatefeedback`,
      data
    );
  }

  ReSheduleTelyphone(
    data: SheduleInterface
  ): Observable<ApiResponce<SheduleResponceInterface>> {
    console.log('detaisl for shedule tech',data)
    return this._http.put<ApiResponce<SheduleResponceInterface>>(
      `/api/interview/telephone/reshedule`,
      data
    );
  }

  ReShedule(
    data: SheduleInterface
  ): Observable<ApiResponce<SheduleResponceInterface>> {
    console.log('detaisl for shedule tech',data)
    return this._http.put<ApiResponce<SheduleResponceInterface>>(
      `/api/interview/reshedule`,
      data
    );
  }

  cancelInterview(
    dto: CancelInterviewInterface
  ): Observable<ApiResponce<SheduleResponceInterface>> {
    return this._http.patch<ApiResponce<SheduleResponceInterface>>(
      `/api/interview/cancelinterview`,
      dto
    );
  }

  finalizeTelephoneResult(
    data: FinalizeResultInterface
  ): Observable<ApiResponce<SheduleResponceInterface>> {
    console.log(data);
    return this._http.post<ApiResponce<SheduleResponceInterface>>(
      `/api/interview/finalize-result`,
      data
    );
  }

  getAllStages(
    applicationId: string
  ): Observable<ApiResponce<any>> {
    return this._http.get<ApiResponce<any>>(
      `/api/interview/all-stages`,
      { params: { applicationId: applicationId } }
    );
  }

  getCompanyApplicants(
    params: { page?: number; limit?: number; search?: string; filtervalue?: string }
  ): Observable<PaginatedResponse<ApplicationInterface[]>> {
    let httpParms = new HttpParams();

    const limit = params.limit || 5;
    const page = params.page || 1;

    httpParms = httpParms.set('limit', limit.toString());
    httpParms = httpParms.set('page', page.toString());

    if (params.search) {
      httpParms = httpParms.set('search', params.search);
    }
    if (params.filtervalue) {
      httpParms = httpParms.set('filtervalue', params.filtervalue);
    }

    return this._http.get<PaginatedResponse<ApplicationInterface[]>>(
      `/api/applications/all-applicants`,
      { params: httpParms }
    );
  }
}
