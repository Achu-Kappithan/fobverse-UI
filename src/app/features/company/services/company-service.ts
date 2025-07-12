import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { CompanyInterface } from '../../admin/interfaces/company.interface';
import { ApiResponce, ComapnyProfileInterface } from '../interfaces/company.responce.interface';
import { captureError } from 'rxjs/internal/util/errorContext';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'http://localhost:3007/api/v1/'; 
  public ComapnySubject = new BehaviorSubject<ComapnyProfileInterface | null>(null)
  company$ = this.ComapnySubject.asObservable()

  constructor(
    private readonly http: HttpClient
  ){}

  getProfile():Observable<ApiResponce<ComapnyProfileInterface>>{
    return this.http.get<ApiResponce<ComapnyProfileInterface>>(`${this.apiUrl}company/profile`,{withCredentials: true}).pipe(
      tap(res =>{
        if(res && res.success){
          console.log("company responce",res)
          this.ComapnySubject.next(res.data)
          console.log("data is  state",this.company$)
        }else{
          this.ComapnySubject.next(null)
          console.log("faild to add get company details")
        }
      }),
    )
  }
}
