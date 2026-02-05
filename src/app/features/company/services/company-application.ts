import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ApplicationQureryInterface,
  CancelInterviewInterface,
} from '../interfaces/company.interface';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/interfaces/api-response.interface';
import {
  ApplicationInterface,
  applicationWithProfile,
  InternalUserInterface,
  PaginatedResponse,
} from '../interfaces/company.response.interface';
import {
  ScheduleInterface,
  ScheduleResponseInterface,
  UpdateFeedbackInterface,
  FinalizeResultInterface,
} from '../interfaces/company.interview-response.interface';
import { Schedule } from '../interfaces/schedule.interface';

@Injectable({
  providedIn: 'root',
})
export class CompanyApplication {
  constructor(private readonly _http: HttpClient) {}

  getAllApplication(
    params: ApplicationQureryInterface
  ): Observable<ApiResponse<ApplicationInterface[]>> {
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
    return this._http.get<ApiResponse<ApplicationInterface[]>>(
      `/api/applications/applicants`,
      { params: httpParms }
    );
  }

  getApplicationDetails(
    appId: string,
    canId: string
  ): Observable<ApiResponse<applicationWithProfile>> {
    return this._http.get<ApiResponse<applicationWithProfile>>(
      `/api/applications/applicationDetails/${appId}/${canId}`
    );
  }

  getHrlist(): Observable<ApiResponse<InternalUserInterface[]>> {
    return this._http.get<ApiResponse<InternalUserInterface[]>>(
      `/api/company/hrusers`
    );
  }

  getInterviewers(): Observable<ApiResponse<InternalUserInterface[]>> {
    return this._http.get<ApiResponse<InternalUserInterface[]>>(
      `/api/company/interviewers`
    );
  }

  sheduleInterview(
    data: ScheduleInterface
  ): Observable<ApiResponse<ScheduleResponseInterface>> {
    console.log('data  for  sheduling interivew',data)
    return this._http.post<ApiResponse<ScheduleResponseInterface>>(
      `/api/interview/shedule`,
      data
    );
  }

  sheduleTelyInterview(
    data: ScheduleInterface
  ): Observable<ApiResponse<ScheduleResponseInterface>> {
    console.log('data  for  sheduling interivew',data)
    return this._http.post<ApiResponse<ScheduleResponseInterface>>(
      `/api/interview/telephone/shedule`,
      data
    );
  }

  getStageDetails(
    applicationId: string,
    stage: string
  ): Observable<ApiResponse<ScheduleResponseInterface>> {
    return this._http.get<ApiResponse<ScheduleResponseInterface>>(
      `/api/interview/getstagedetails`,
      { params: { applicationId: applicationId, stage: stage } }
    );
  }

  updateFeedback(
    data: UpdateFeedbackInterface
  ): Observable<ApiResponse<ScheduleResponseInterface>> {
    console.log('updatting feedbak data', data);
    return this._http.post<ApiResponse<ScheduleResponseInterface>>(
      `/api/interview/updatefeedback`,
      data
    );
  }

  ReSheduleTelyphone(
    data: ScheduleInterface
  ): Observable<ApiResponse<ScheduleResponseInterface>> {
    console.log('detaisl for shedule tech',data)
    return this._http.put<ApiResponse<ScheduleResponseInterface>>(
      `/api/interview/telephone/reshedule`,
      data
    );
  }

  ReShedule(
    data: ScheduleInterface
  ): Observable<ApiResponse<ScheduleResponseInterface>> {
    console.log('detaisl for shedule tech',data)
    return this._http.put<ApiResponse<ScheduleResponseInterface>>(
      `/api/interview/reshedule`,
      data
    );
  }

  cancelInterview(
    dto: CancelInterviewInterface
  ): Observable<ApiResponse<ScheduleResponseInterface>> {
    return this._http.patch<ApiResponse<ScheduleResponseInterface>>(
      `/api/interview/cancelinterview`,
      dto
    );
  }

  finalizeTelephoneResult(
    data: FinalizeResultInterface
  ): Observable<ApiResponse<ScheduleResponseInterface>> {
    console.log(data);
    return this._http.post<ApiResponse<ScheduleResponseInterface>>(
      `/api/interview/finalize-result`,
      data
    );
  }

  getAllStages(
    applicationId: string
  ): Observable<ApiResponse<any>> {
    return this._http.get<ApiResponse<any>>(
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

  getMySchedules(status?: string): Observable<ApiResponse<Schedule[]>> {
    let httpParams = new HttpParams();
    if (status) {
      httpParams = httpParams.set('status', status);
    }
    return this._http.get<ApiResponse<Schedule[]>>(`/api/interview/my-schedules`, {
      params: httpParams,
    });
  }
}
