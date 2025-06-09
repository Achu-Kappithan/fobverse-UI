import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CandidateRegistration } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserRegisterService {
  private apiUrl ="http://localhost:3008/"

  constructor(private http:HttpClient) { }

  registerCandidate(candidate:CandidateRegistration):Observable<any>{
    console.log("data send to the backend for registration from regiser service ",candidate)
    return this.http.post(`${this.apiUrl}auth/registeruser`,candidate)
  }
}
