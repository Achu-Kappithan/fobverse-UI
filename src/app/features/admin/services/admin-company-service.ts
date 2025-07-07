import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ApiResponce } from '../../auth/interfaces/api-responce.interface';
import {
  CandidateInterface,
  CompanyInterface,
} from '../interfaces/company.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminCompanyService {
  private apiUrl = 'http://localhost:3007/api/v1/';
  private _CompnayState = new BehaviorSubject<CompanyInterface[]>([]);
  company$ = this._CompnayState.asObservable();

  constructor(private readonly http: HttpClient) {}

  getAllCompanies(): Observable<ApiResponce<CompanyInterface[]>> {
    return this.http.get<ApiResponce<CompanyInterface[]>>(
      `${this.apiUrl}admin/getallcompany`,
      { withCredentials: true }
    );
  }

  getAllCandidates(): Observable<ApiResponce<CandidateInterface[]>> {
    return this.http.get<ApiResponce<CandidateInterface[]>>(
      `${this.apiUrl}admin/getallcandidates`,
      { withCredentials: true }
    );
  }
}
