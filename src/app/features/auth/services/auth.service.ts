import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CandidateRegistration, loginInterface, passwordUpdate, validateEmailAndRole } from '../interfaces/auth.interface';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';
import {
  ApiResponce,
  PlainResponce,
  User,
  UserPartial,
} from '../../../shared/interfaces/apiresponce.interface';
import { PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserRegisterService {
  private apiUrl = 'http://localhost:3007/api/v1/'; 
  public adminSubject = new BehaviorSubject<UserPartial | null>(null)
  admin$ = this.adminSubject.asObservable()
  public CompanySubject = new BehaviorSubject<UserPartial | null>(null)
  company$ = this.CompanySubject.asObservable()
  public isUserLoaded = new BehaviorSubject<boolean>(false)
  isLoading$ = this.isUserLoaded.asObservable()
  private _router = inject(Router)

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
  }

  registerCandidate(candidate: CandidateRegistration): Observable<any> {
    return this.http.post(`${this.apiUrl}auth/register`, candidate,{withCredentials: true});
  }

  candidateVarification(token: string): Observable<ApiResponce<UserPartial>> {
    return this.http.get<ApiResponce<UserPartial>>(
      `${this.apiUrl}auth/verify-email?token=${token}`,{withCredentials: true}
    );
  }

  candidateLogin(
    candidate: loginInterface
  ): Observable<ApiResponce<UserPartial>> {
    return this.http.post<ApiResponce<UserPartial>>(`${this.apiUrl}auth/login`, candidate,{withCredentials: true})
    .pipe(
      tap(res =>{
        if(res.success && res.data){
          console.log("responce service data",res.data)
          if(res.data.role == 'admin'){
            this.adminSubject.next(res.data)
          }else if(res.data.role == 'company'){
            this.CompanySubject.next(res.data)
          }
        }
      })
    )
  }

  getCurrentUserDetails(): Observable<ApiResponce<UserPartial>> {
    console.log("try to get user details")
    return this.http.get<ApiResponce<UserPartial>>(`${this.apiUrl}auth/getuser`,{withCredentials: true})
    .pipe(
      tap(response =>{
        if(response.success && response.data){
          console.log(response.data)
          if(response.data.role == 'admin'){
          this.adminSubject.next(response.data)
          }else if(response.data.role == 'company'){
            this.CompanySubject.next(response.data)
            console.log(`${response.data.email} is active company`); 
          }
        }else{
          this.adminSubject.next(null)
          console.log("no active user found")
        }
        this.isUserLoaded.next(true)
      }),
      catchError(err => {
      this.adminSubject.next(null);
      this.isUserLoaded.next(true); 
      return throwError(() => err);
    })
    )
  }

  refreshToken(): Observable<any> {
    console.log('Attempting to refresh token...');
    return this.http.post(`${this.apiUrl}auth/refresh`, {},{withCredentials: true})
      .pipe(
        tap(response => {
          console.log('Refresh token successful. New access token set via cookie.',response);
        }),
        catchError(error => {
          console.error('Refresh token failed:', error);
          this.adminSubject.next(null); 
          return of (null)
        })
      );
  }

  hasRefreshToken():boolean{
    let refreshtoken = document.cookie.includes('refresh_token=')
    return refreshtoken
  }

  logoutUser(): void {
    this.http.post(`${this.apiUrl}auth/logout`, {}, { withCredentials: true }).subscribe({
      next:(res)=>{
        this.adminSubject.next(null)
        this.isUserLoaded.next(true)
        this._router.navigate(['/login'])
      }
    })

  }

  googleLogin(googleId:string,userType:string):Observable<ApiResponce<UserPartial>>{
    return this.http.get<ApiResponce<UserPartial>>(`${this.apiUrl}auth/google?googleId=${googleId}&role=${userType}`,{withCredentials: true})
  }

  adminLogin(loginInfo:loginInterface):Observable<ApiResponce<UserPartial>>{
    return this.http.post<ApiResponce<UserPartial>>(`${this.apiUrl}auth/admin/login`,loginInfo,{withCredentials: true})
    .pipe(
      tap(res=>{
        if(res.data && res.success){
          console.log("uuuuuuuuuuuuuuuuu",res.data)
          this.adminSubject.next(res.data)
        }
      })
    )
  }

  validateFogotpassEmail(user:validateEmailAndRole):Observable<PlainResponce>{
    return this.http.post<PlainResponce>(`${this.apiUrl}auth/forgotpassword`,user,{withCredentials: true})
  }

  updateNewPassword(data:passwordUpdate):Observable<PlainResponce>{
    return this.http.post<PlainResponce>(`${this.apiUrl}auth/updatepassword`,data,{withCredentials: true})
  }
}
