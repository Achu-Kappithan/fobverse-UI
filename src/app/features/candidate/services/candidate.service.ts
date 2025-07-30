import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponce } from '../interfaces/responce.interface';
import { CandidateInterface } from '../interfaces/candidate.interface';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(private readonly http: HttpClient){}

  GetPorfile():Observable<ApiResponce<CandidateInterface>>{
    return this.http.get<ApiResponce<CandidateInterface>>(`api/candidate/getprofile`,{withCredentials:true})
  }
}
