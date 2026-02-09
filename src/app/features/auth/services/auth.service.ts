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
  ApiResponse,
  PlainResponse,
  UserPartial,
} from '../../../shared/interfaces/api-response.interface';
import { PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyProfileInterface } from '../../company/interfaces/company.response.interface';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { LoggerService } from '../../../shared/services/logger/logger.service';
import { APP_ROUTES } from '../../../shared/constants/routes.constants';
import { environment } from '../../../../env/environment';

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
  private _logger = inject(LoggerService);

  constructor(
    private _http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  registerCandidate(candidate: CandidateRegistration): Observable<any> {
    return this._http.post(`${environment.apiUrl}/auth/register`, candidate, {
      withCredentials: true,
    });
  }

  candidateVerification(token: string): Observable<ApiResponse<UserPartial>> {
    return this._http.get<ApiResponse<UserPartial>>(
      `${environment.apiUrl}/auth/verify-email?token=${token}`,
      { withCredentials: true }
    );
  }

  candidateLogin(
    candidate: loginInterface
  ): Observable<ApiResponse<UserPartial>> {
    this.isUserLoaded.next(false);
    return this._http
      .post<ApiResponse<UserPartial>>(`${environment.apiUrl}/auth/login`, candidate, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            this._logger.info('Login successful, updating CandidateSubject', { user: res.data.email });
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

  getCurrentUserDetails(): Observable<ApiResponse<UserPartial>> {
    this._logger.debug('Attempting to fetch current user details');
    return this._http
      .get<ApiResponse<UserPartial>>(`${environment.apiUrl}/auth/getuser`, {
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
            this._logger.info(`Session active for: ${response.data.email} (${response.data.role})`);
          } else {
            this.adminSubject.next(null);
            this.CompanySubject.next(null);
            this.CandidateSubject.next(null);
            this._logger.debug('No active session found');
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
    this._logger.debug('Attempting to refresh token...');
    return this._http
      .post(`${environment.apiUrl}/auth/refresh`, {}, { withCredentials: true })
      .pipe(
        tap((response) => {
          this._logger.info('Refresh token successful. New access token set via cookie.');
        }),
        catchError((error) => {
          this._logger.error('Refresh token failed', error);
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
      .post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .subscribe({
        next: (res) => {
          this._socialAuthService.signOut().catch(err => this._logger.warn('Social sign out failed or already signed out'));
          if (User == 'company') {
            this.CompanySubject.next(null);
            this._router.navigate([`/${APP_ROUTES.COMPANY_LOGIN}`]);
          } else if (User === 'admin') {
            this.adminSubject.next(null);
            this._router.navigate([`/${APP_ROUTES.ADMIN_LOGIN}`]);
          } else if(User ==='candidate') {
            this.CandidateSubject.next(null);
            this._router.navigate([`/${APP_ROUTES.HOME}`]);
          }

          this.isUserLoaded.next(true);
        },
      });
  }

  googleLogin(
    googleId: string,
    userType: string
  ): Observable<ApiResponse<UserPartial>> {
    this.isUserLoaded.next(false);
    return this._http
      .get<ApiResponse<UserPartial>>(
        `${environment.apiUrl}/auth/google?googleId=${googleId}&role=${userType}`,
        { withCredentials: true }
      )
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            this._logger.info('Google login successful, updating subjects', { user: res.data.email });
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

  adminLogin(loginInfo: loginInterface): Observable<ApiResponse<UserPartial>> {
    this.isUserLoaded.next(false);
    return this._http
      .post<ApiResponse<UserPartial>>(`${environment.apiUrl}/auth/admin/login`, loginInfo, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            this._logger.info('Admin login successful, updating adminSubject', { user: res.data.email });
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
  ): Observable<ApiResponse<CompanyProfileInterface | any>> {
    this.isUserLoaded.next(false);
    return this._http
      .post<ApiResponse<CompanyProfileInterface | any>>(
        `${environment.apiUrl}/auth/companyuserslogin`,
        loginInfo,
        { withCredentials: true }
      )
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            this._logger.info('Company user login successful, updating CompanySubject', { user: res.data.email });
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

  validateForgotPasswordEmail(
    user: validateEmailAndRole
  ): Observable<PlainResponse> {
    return this._http.post<PlainResponse>(`${environment.apiUrl}/auth/forgotpassword`, user, {
      withCredentials: true,
    });
  }

  updateNewPassword(data: passwordUpdate): Observable<PlainResponse> {
    return this._http.post<PlainResponse>(`${environment.apiUrl}/auth/updatepassword`, data, {
      withCredentials: true,
    });
  }
}
