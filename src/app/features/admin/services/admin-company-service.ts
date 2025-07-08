import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ApiResponce, PlainResponce } from '../../auth/interfaces/api-responce.interface';
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

  updateStatus(id:string):Observable<PlainResponce>{
    return this.http.get<PlainResponce>(`${this.apiUrl}admin/company/updatestatus?id=${id}`,{withCredentials : true})
  }

}
