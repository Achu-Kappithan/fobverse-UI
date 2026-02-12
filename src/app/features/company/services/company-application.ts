import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoggerService } from '../../../shared/services/logger/logger.service';
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
import { environment } from '../../../../env/environment';

@Injectable({
  providedIn: 'root',
})
export class CompanyApplication {
  private readonly _logger = inject(LoggerService);
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
      `${environment.apiUrl}/applications/applicants`,
      { params: httpParms }
    );
  }

  getApplicationDetails(
    appId: string,
    canId: string
  ): Observable<ApiResponse<applicationWithProfile>> {
    return this._http.get<ApiResponse<applicationWithProfile>>(
      `${environment.apiUrl}/applications/applicationDetails/${appId}/${canId}`
    );
  }

  getHrlist(): Observable<ApiResponse<InternalUserInterface[]>> {
    return this._http.get<ApiResponse<InternalUserInterface[]>>(
      `${environment.apiUrl}/company/hrusers`
    );
  }

  getInterviewers(): Observable<ApiResponse<InternalUserInterface[]>> {
    return this._http.get<ApiResponse<InternalUserInterface[]>>(
      `${environment.apiUrl}/company/interviewers`
    );
  }

  sheduleInterview(
    data: ScheduleInterface
  ): Observable<ApiResponse<ScheduleResponseInterface>> {
    this._logger.log('Scheduling interview', data);
    return this._http.post<ApiResponse<ScheduleResponseInterface>>(
      `${environment.apiUrl}/interview/shedule`,
      data
    );
  }

  sheduleTelyInterview(
    data: ScheduleInterface
  ): Observable<ApiResponse<ScheduleResponseInterface>> {
    this._logger.log('Scheduling telephone interview', data);
    return this._http.post<ApiResponse<ScheduleResponseInterface>>(
      `${environment.apiUrl}/interview/telephone/shedule`,
      data
    );
  }

  getStageDetails(
    applicationId: string,
    stage: string
  ): Observable<ApiResponse<ScheduleResponseInterface>> {
    return this._http.get<ApiResponse<ScheduleResponseInterface>>(
      `${environment.apiUrl}/interview/getstagedetails`,
      { params: { applicationId: applicationId, stage: stage } }
    );
  }

  updateFeedback(
    data: UpdateFeedbackInterface
  ): Observable<ApiResponse<ScheduleResponseInterface>> {
    this._logger.log('Updating feedback', data);
    return this._http.post<ApiResponse<ScheduleResponseInterface>>(
      `${environment.apiUrl}/interview/updatefeedback`,
      data
    );
  }

  ReSheduleTelyphone(
    data: ScheduleInterface
  ): Observable<ApiResponse<ScheduleResponseInterface>> {
    this._logger.log('Rescheduling telephone interview', data);
    return this._http.put<ApiResponse<ScheduleResponseInterface>>(
      `${environment.apiUrl}/interview/telephone/reshedule`,
      data
    );
  }

  ReShedule(
    data: ScheduleInterface
  ): Observable<ApiResponse<ScheduleResponseInterface>> {
    this._logger.log('Rescheduling interview', data);
    return this._http.put<ApiResponse<ScheduleResponseInterface>>(
      `${environment.apiUrl}/interview/reshedule`,
      data
    );
  }

  cancelInterview(
    dto: CancelInterviewInterface
  ): Observable<ApiResponse<ScheduleResponseInterface>> {
    return this._http.patch<ApiResponse<ScheduleResponseInterface>>(
      `${environment.apiUrl}/interview/cancelinterview`,
      dto
    );
  }

  finalizeTelephoneResult(
    data: FinalizeResultInterface
  ): Observable<ApiResponse<ScheduleResponseInterface>> {
    this._logger.log('Finalizing telephone result', data);
    return this._http.post<ApiResponse<ScheduleResponseInterface>>(
      `${environment.apiUrl}/interview/finalize-result`,
      data
    );
  }

  getAllStages(
    applicationId: string
  ): Observable<ApiResponse<Record<string, unknown>>> {
    return this._http.get<ApiResponse<Record<string, unknown>>>(
      `${environment.apiUrl}/interview/all-stages`,
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
      `${environment.apiUrl}/applications/all-applicants`,
      { params: httpParms }
    );
  }

  getMySchedules(status?: string): Observable<ApiResponse<Schedule[]>> {
    let httpParams = new HttpParams();
    if (status) {
      httpParams = httpParams.set('status', status);
    }
    return this._http.get<ApiResponse<Schedule[]>>(`${environment.apiUrl}/interview/my-schedules`, {
      params: httpParams,
    });
  }
}
