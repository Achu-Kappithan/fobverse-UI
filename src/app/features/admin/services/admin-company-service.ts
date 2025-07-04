import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponce } from '../../auth/interfaces/api-responce.interface';
import { CompanyInterface } from '../interfaces/company.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminCompanyService {
private apiUrl = 'http://localhost:3007/api/v1/';

constructor(
  private readonly http : HttpClient
){}

getAllCompanies(){
 return this.http.get(`${this.apiUrl}admin/getallcompany`,{withCredentials: true})
}

}
