import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponce, PlainResponce } from '../../auth/interfaces/api-responce.interface';
import { CandidateInterface } from '../interfaces/company.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminCandidate {

  
    constructor(private readonly http: HttpClient) {}
  
    getAllCandidates(): Observable<ApiResponce<CandidateInterface[]>> {
      return this.http.get<ApiResponce<CandidateInterface[]>>(
        `/api/admin/getAllcandidates`,
        { withCredentials: true }
      );
    }

  updateStatus(id:string):Observable<PlainResponce>{
    console.log(id)
    return this.http.get<PlainResponce>(`/api/admin/candidate/updatestatus?id=${id}`,{withCredentials:true})
  }
  
}
