import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CandidateInterface } from '../interfaces/candidate.interface';
import { ApiResponce } from '../../../shared/interfaces/apiresponce.interface';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(private readonly _http: HttpClient){}

  GetPorfile():Observable<ApiResponce<CandidateInterface>>{
    return this._http.get<ApiResponce<CandidateInterface>>(`api/candidate/getprofile`,{withCredentials:true})
  }

  updateProfile(data:CandidateInterface):Observable<ApiResponce<CandidateInterface>>{
    return this._http.post<ApiResponce<CandidateInterface>>('/api/candidate/updataprofile',data,{withCredentials:true})
  }
}
