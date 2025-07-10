import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponce, ComapnyProfile } from '../interfaces/company.responce.interface';
import { CompanyInterface } from '../../admin/interfaces/company.interface';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'http://localhost:3007/api/v1/'; 

  constructor(
    private readonly http: HttpClient
  ){}

  getProfile():Observable<ApiResponce<ComapnyProfile>>{
    return this.http.get<ApiResponce<CompanyInterface>>(`${this.apiUrl}company/profile`,{withCredentials: true})
  }
}
