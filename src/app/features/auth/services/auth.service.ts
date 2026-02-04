import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  CandidateRegistration,
  loginInterface,
  passwordUpdate,
  validateEmailAndRole,
} from '../interfaces/auth.interface';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import {
  ApiResponce,
  PlainResponce,
  UserPartial,
} from '../../../shared/interfaces/apiresponce.interface';
import { PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ComapnyProfileInterface } from '../../company/interfaces/company.responce.interface';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public adminSubject = new BehaviorSubject<UserPartial | null>(null);
  admin$ = this.adminSubject.asObservable();
  public CompanySubject = new BehaviorSubject<UserPartial | null>(null);
  company$ = this.CompanySubject.asObservable();
  public CandidateSubject = new BehaviorSubject<UserPartial | null>(null);
  candidate$ = this.CandidateSubject.asObservable();
  public isUserLoaded = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isUserLoaded.asObservable();
  private _router = inject(Router);
  private _socialAuthService = inject(SocialAuthService);

  constructor(
    private _http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  registerCandidate(candidate: CandidateRegistration): Observable<any> {
    return this._http.post(`/api/auth/register`, candidate, {
      withCredentials: true,
    });
  }

  candidateVarification(token: string): Observable<ApiResponce<UserPartial>> {
    return this._http.get<ApiResponce<UserPartial>>(
      `/api/auth/verify-email?token=${token}`,
      { withCredentials: true }
    );
  }

  candidateLogin(
    candidate: loginInterface
  ): Observable<ApiResponce<UserPartial>> {
    this.isUserLoaded.next(false);
    return this._http
      .post<ApiResponce<UserPartial>>(`/api/auth/login`, candidate, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            console.log('Login successful, updating CandidateSubject', res.data);
            this.adminSubject.next(null);
            this.CompanySubject.next(null);
            this.CandidateSubject.next(res.data);
          }
          this.isUserLoaded.next(true);
        }),
        catchError((err) => {
          this.isUserLoaded.next(true);
          return throwError(() => err);
        })
      );
  }

  getCurrentUserDetails(): Observable<ApiResponce<UserPartial>> {
    console.log('try to get user details');
    return this._http
      .get<ApiResponce<UserPartial>>(`/api/auth/getuser`, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            if (response.data.role === 'admin') {
              this.adminSubject.next(response.data);
            } else if (response.data.role === 'candidate') {
              this.CandidateSubject.next(response.data);
            } else {
              this.CompanySubject.next(response.data);
            }
            console.log(
              `${response.data.email} is active ${response.data.role}`
            );
          } else {
            this.adminSubject.next(null);
            this.CompanySubject.next(null);
            this.CandidateSubject.next(null);
            console.log('no active user found');
          }
          this.isUserLoaded.next(true);
        }),
        catchError((err) => {
          this.adminSubject.next(null);
          this.CompanySubject.next(null);
          this.CandidateSubject.next(null);
          this.isUserLoaded.next(true);
          return throwError(() => err);
        })
      );
  }

  refreshToken(): Observable<any> {
    console.log('Attempting to refresh token...');
    return this._http
      .post(`/api/auth/refresh`, {}, { withCredentials: true })
      .pipe(
        tap((response) => {
          console.log(
            'Refresh token successful. New access token set via cookie.',
            response
          );
        }),
        catchError((error) => {
          console.error('Refresh token failed:', error);
          this.adminSubject.next(null);
          return of(null);
        })
      );
  }

  hasRefreshToken(): boolean {
    let refreshtoken = document.cookie.includes('refresh_token=');
    return refreshtoken;
  }

  logoutUser(User: string): void {
    this._http
      .post(`/api/auth/logout`, {}, { withCredentials: true })
      .subscribe({
        next: (res) => {
          this._socialAuthService.signOut().catch(err => console.log('Social sign out failed or already signed out'));
          if (User == 'company') {
            this.CompanySubject.next(null);
            this._router.navigate(['/companylogin']);
          } else if (User === 'admin') {
            this.adminSubject.next(null);
            this._router.navigate(['/adminlogin']);
          } else if(User ==='candidate') {
            this.CandidateSubject.next(null);
            this._router.navigate(['/candidate/home']);
          }

          this.isUserLoaded.next(true);
        },
      });
  }

  googleLogin(
    googleId: string,
    userType: string
  ): Observable<ApiResponce<UserPartial>> {
    this.isUserLoaded.next(false);
    return this._http
      .get<ApiResponce<UserPartial>>(
        `/api/auth/google?googleId=${googleId}&role=${userType}`,
        { withCredentials: true }
      )
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            console.log('Google login successful, updating subjects', res.data);
            if (userType === 'admin') this.adminSubject.next(res.data);
            else if (userType === 'candidate') this.CandidateSubject.next(res.data);
            else this.CompanySubject.next(res.data);
          }
          this.isUserLoaded.next(true);
        }),
        catchError((err) => {
          this.isUserLoaded.next(true);
          return throwError(() => err);
        })
      );
  }

  adminLogin(loginInfo: loginInterface): Observable<ApiResponce<UserPartial>> {
    this.isUserLoaded.next(false);
    return this._http
      .post<ApiResponce<UserPartial>>(`/api/auth/admin/login`, loginInfo, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            console.log('Admin login successful, updating adminSubject', res.data);
            this.adminSubject.next(res.data);
            this.CompanySubject.next(null);
            this.CandidateSubject.next(null);
          }
          this.isUserLoaded.next(true);
        }),
        catchError((err) => {
          this.isUserLoaded.next(true);
          return throwError(() => err);
        })
      );
  }

  companyUsersLogin(
    loginInfo: loginInterface
  ): Observable<ApiResponce<ComapnyProfileInterface | any>> {
    this.isUserLoaded.next(false);
    return this._http
      .post<ApiResponce<ComapnyProfileInterface | any>>(
        '/api/auth/companyuserslogin',
        loginInfo,
        { withCredentials: true }
      )
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            console.log('Company user login successful, updating CompanySubject', res.data);
            this.adminSubject.next(null);
            this.CandidateSubject.next(null);
            this.CompanySubject.next(res.data);
          }
          this.isUserLoaded.next(true);
        }),
        catchError((err) => {
          this.isUserLoaded.next(true);
          return throwError(() => err);
        })
      );
  }

  validateFogotpassEmail(
    user: validateEmailAndRole
  ): Observable<PlainResponce> {
    return this._http.post<PlainResponce>(`/api/auth/forgotpassword`, user, {
      withCredentials: true,
    });
  }

  updateNewPassword(data: passwordUpdate): Observable<PlainResponce> {
    return this._http.post<PlainResponce>(`/api/auth/updatepassword`, data, {
      withCredentials: true,
    });
  }
}
