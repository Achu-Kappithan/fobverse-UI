import { Routes } from '@angular/router';
import { EmailVerificationFailedComponent } from './features/auth/components/email-verification/email-verification-faild/email-verification-faild';
import { EmailVerificationSuccessComponent } from './features/auth/components/email-verification/email-verification-success/email-verification-success';
import { EmailVerificationComponent } from './features/auth/components/email-verification/email-verification';
import { CandidateHomeComponent } from './features/candidate/components/candidate-home/candidate-home';
import { AuthComponent } from './features/layout/auth-layout/authcomponent';
import { CompanyHomeComponent } from './features/company/components/company-home/company.home';
import { ForgotPassEmailComponent } from './features/auth/components/forgot-password/forgot.pass.email/forgot.pass.email';
import { SetNewPasswordComponent } from './features/auth/components/forgot-password/set-new-password/set-new-password';
import { UpdateProfileInfoComponent } from './features/company/components/update-profile-info/update-profileinfo';

import { APP_ROUTES } from './shared/constants/routes.constants';

import { AddInternalUserComponent } from './features/company/components/internal-users/add-internal-user/add-internal-user.component';
import { UserListComponent } from './features/company/components/internal-users/user-list/user-list.component';
import { isLogoutGuard } from './shared/guards/auth-guards/is-logout-guard';
import { authGurdGuard } from './shared/guards/auth-guards/auth-gurd-guard';
import { isAdminGuard } from './shared/guards/admin-guards/is-admin-guard';
import { isCompanyAdminGuard } from './shared/guards/company-guards/is-company-admin.guard';
import { isHrUserGuard } from './shared/guards/company-guards/is-hr-user.guard';
import { isInterviewerGuard } from './shared/guards/company-guards/is-interviewer.guard';
import { LoginComponent } from './features/auth/components/login/login';
import { SignupComponent } from './features/auth/components/signup/signup';
import { CreateJobComponent } from './features/company/components/create-job/create-job';
import { JobViewComponent } from './features/company/components/jobs/job-view/job-view';
import { JobEditingComponent } from './features/company/components/jobs/job-editing/job-editing';
import { CompanyPublicProfileComponent } from './features/company/components/company-public-profile/company-public-profile';
import { JobsPublicViewComponent } from './features/company/components/jobs-public-view/jobs-public-view';

export const routes: Routes = [
  {
    path: '',
    redirectTo: APP_ROUTES.HOME,
    pathMatch: 'full',
  },


  {
    path: APP_ROUTES.FORGOT_PASSWORD,
    loadComponent: () =>
      import(
        './features/layout/forgot-password-layout/forgotpasswordcomponent'
      ).then((m) => m.ForgotPasswordComponent),
    children: [
      {
        path: 'email',
        component: ForgotPassEmailComponent,
      },
      {
        path: 'newpassword',
        component: SetNewPasswordComponent,
      },
    ],
  },


  {
    path: 'email',
    loadComponent: () =>
      import('./features/layout/email-layout/email-component').then(
        (m) => m.EmailComponent
      ),
    children: [
      { path: 'verification', component: EmailVerificationComponent },
      { path: 'failed', component: EmailVerificationFailedComponent },
      { path: 'success', component: EmailVerificationSuccessComponent },
    ],
  },

  {
    path: '',
    component: AuthComponent,
    children: [


      {
        path: APP_ROUTES.LOGIN,
        canActivate: [isLogoutGuard],
        component: LoginComponent,
        data: { userType: 'candidate' },
      },
      {
        path: APP_ROUTES.SIGNUP,
        canActivate: [isLogoutGuard],
        component: SignupComponent,
        data: { userType: 'candidate' },
      },
      {
        path: APP_ROUTES.ADMIN_LOGIN,
        canActivate: [isLogoutGuard],
        component: LoginComponent,
        data: { userType: 'admin' },
      },
      {
        path: APP_ROUTES.COMPANY_LOGIN,
        canActivate: [isLogoutGuard],
        component: LoginComponent,
        data: { userType: 'company_admin' },
      },
      {
        path: APP_ROUTES.COMPANY_SIGNUP,
        canActivate: [isLogoutGuard],
        component: SignupComponent,
        data: { userType: 'company_admin' },
      },
    ],
  },



  {
    path: APP_ROUTES.CANDIDATE,
    loadComponent: () =>
      import('./features/layout/candidate-layout/candidatecomponent').then(
        (m) => m.CandidateLayoutComponent
      ),
    children: [
      {
        path: 'home',
        component: CandidateHomeComponent,
      },
      {
        path: 'profile',
        canActivate: [authGurdGuard],
        loadComponent: () =>
          import(
            './features/candidate/components/candidate-profile/candidate-profile'
          ).then((m) => m.CandidateProfileComponent),
      },
      {
        path: 'profile/updateprofile',
        canActivate: [authGurdGuard],
        loadComponent: () =>
          import(
            './features/candidate/components/update-profile/update-profile'
          ).then((m) => m.UpdateProfileComponent),
      },
      {
        path: 'settings',
        canActivate: [authGurdGuard],
        loadComponent: () =>
          import(
            './features/candidate/components/candidate-settings/candidate-settings'
          ).then((m) => m.CandidateSettingsComponent),
      },
      {
        path: 'my-applications',
        canActivate: [authGurdGuard],
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/candidate/components/my-applications/my-applications'
              ).then((m) => m.MyApplicationsComponent),
          },
          {
            path: 'applications/:jobId/viewapplication/:appId',
            loadComponent: () =>
              import(
                './features/layout/video-layout/video-layout-component'
              ).then((m) => m.VideoLayoutComponent),
            children: [
              {
                path: '',
                loadComponent: () =>
                  import(
                    './features/candidate/components/my-applications/components/candidate-application-details/candidate-application-details.component'
                  ).then((m) => m.CandidateApplicationDetailsComponent),
              },
              {
                path: 'video-interview/:roomId',
                loadComponent: () =>
                  import(
                    './features/video-interview/video-interview.component'
                  ).then((m) => m.VideoInterviewComponent),
              },
            ],
          },
        ],
      },

      {
        path: 'joblist',
        loadComponent: () =>
          import(
            './features/candidate/components/layout-job-list/layout-jolist'
          ).then((m) => m.LayoutJobListComponent),
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/candidate/components/candidate-job-list/candidate-joblist'
              ).then((m) => m.CandidateJobListComponent),
          },
          {
            path: 'jobsview',
            loadComponent: () =>
              import(
                './features/company/components/jobs-public-view/jobs-public-view'
              ).then((m) => m.JobsPublicViewComponent),
          },
        ],
      },
      {
        path: 'companylist',
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/candidate/components/candidate-company-list/candidate-companylist'
              ).then((m) => m.CandidateCompanyListComponent),
          },
          {
            path: 'companyprofile',
            loadComponent: () =>
              import(
                './features/company/components/company-public-profile/company-public-profile'
              ).then((m) => m.CompanyPublicProfileComponent),
          },
        ],
      },
      {
        path: 'about-us',
        loadComponent: () =>
          import(
            './features/candidate/components/about-us/about-us'
          ).then((m) => m.AboutUsComponent),
      },
    ],
  },



  {
    path: APP_ROUTES.COMPANY,
    loadComponent: () =>
      import('./features/layout/company-layout/company-component').then(
        (m) => m.CompanyComponent
      ),
    canActivate: [authGurdGuard, isInterviewerGuard],
    children: [
      {
        path: 'home',
        component: CompanyHomeComponent,
      },
      {
        path: 'profile',
        loadComponent: () =>
          import(
            './features/company/components/company-profile/company-profile'
          ).then((m) => m.CompanyProfileComponent),
        children: [
          {
            path: 'updateprofile',
            component: UpdateProfileInfoComponent,
            canActivate: [isCompanyAdminGuard],
          },
          {
            path: 'newjob',
            component: CreateJobComponent,
            canActivate: [isHrUserGuard],
          },
          {
            path: 'publicview',
            component: CompanyPublicProfileComponent,
          },
          {
            path: 'jobview',
            component: JobsPublicViewComponent,
          },
        ],
      },
      {
        path: 'internalusers',
        loadComponent: () =>
          import(
            './features/company/components/internal-users/internal-users.component'
          ).then((m) => m.InternalUsersComponent),
        canActivate: [isCompanyAdminGuard],
        children: [
          {
            path: '',
            component: UserListComponent,
          },
          {
            path: 'createuser',
            component: AddInternalUserComponent,
          },
        ],
      },
      {
        path: 'userprofile',
        loadComponent: () =>
          import(
            './features/company/components/user-profile/user-profile'
          ).then((m) => m.UserProfileComponent),
      },
      {
        path: 'all-applicants',
        loadComponent: () =>
          import(
            './features/company/components/all-applicants/all-applicants'
          ).then((m) => m.AllApplicantsComponent),
        canActivate: [isInterviewerGuard]
      },
      {
        path: 'my-schedules',
        loadComponent: () =>
          import(
            './features/company/components/my-schedules/my-schedules'
          ).then((m) => m.MySchedulesComponent),
      },
      {
        path: 'joblist',
        loadComponent: () =>
          import('./features/company/components/jobs/jobs').then((m) => m.JobsComponent),
        canActivate: [isInterviewerGuard],
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/company/components/jobs/jobs-list/jobs-list'
              ).then((m) => m.JobsListComponent),
          },
          {
            path: 'jobview',
            component: JobViewComponent,
          },
          {
            path: 'jobedit',
            component: JobEditingComponent,
            canActivate: [isHrUserGuard],
          },
          {
            path: 'applications/:id',
            loadComponent: () =>
              import(
                './features/company/components/company-application-layout/company-application-layout'
              ).then((m) => m.CompanyApplicationLayoutComponent),
            children: [
              {
                path: '',
                loadComponent: () =>
                  import(
                    './features/company/components/company-application-layout/company-jobapplications/company-jobapplications'
                  ).then((m) => m.CompanyJobApplicationsComponent),
              },
              {
                path: 'viewprofile',
                loadComponent: () =>
                  import(
                    './features/candidate/components/candidate-profile-public-view/candidate-profile-publicview'
                  ).then((m) => m.CandidateProfilePublicViewComponent),
              },
              {
                path: 'viewapplication/:appId/:canId',
                loadComponent: () =>
                  import(
                    './features/layout/video-layout/video-layout-component'
              ).then((m) => m.VideoLayoutComponent),
                children: [
                  {
                    path: '',
                    loadComponent: () =>
                      import(
                        './features/company/components/company-application-layout/application-details/application-details'
                      ).then((m) => m.ApplicationDetailsComponent),
                  },
                  {
                    path: 'video-interview/:roomId',
                    loadComponent: () =>
                      import(
                        './features/video-interview/video-interview.component'
                      ).then((m) => m.VideoInterviewComponent),
                  },
                ],
              },
            ],
          },
          {
            path: '',
            loadComponent: () =>
              import(
                './features/company/components/company-application-layout/company-jobapplications/company-jobapplications'
              ).then((m) => m.CompanyJobApplicationsComponent),
          },
        ],
      },
      {
        path: '**',
        loadComponent: () =>
          import('./common/not-found/not-found').then((m) => m.NotFoundComponent),
      },
    ],
  },



  {
    path: APP_ROUTES.ADMIN,
    canActivate: [isAdminGuard, authGurdGuard],
    loadComponent: () =>
      import('./features/layout/admin-layout/admin-component').then(
        (m) => m.AdminComponent
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './features/admin/components/admin-dashboard/admin-dashboard'
          ).then((m) => m.AdminDashboardComponent),
      },
      {
        path: 'companies',
        loadComponent: () =>
          import('./features/admin/components/company/company').then(
            (m) => m.AdminCompanyComponent
          ),
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/admin/components/admin-list-companies/admin-list-companies.component'
              ).then((m) => m.AdminListCompaniesComponent),
          },
          {
            path: 'viewprofile',
            loadComponent: () =>
              import(
                './features/company/components/company-public-profile/company-public-profile'
              ).then((m) => m.CompanyPublicProfileComponent),
          },
        ],
      },
      {
        path: 'candidates',
        loadComponent: () =>
          import('./features/admin/components/candidates/candidates').then(
            (m) => m.CandidatesComponent
          ),
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/admin/components/admin-candidates-list/admin-candidates-list'
              ).then((m) => m.AdminCandidatesListComponent),
          },
          {
            path: 'viewprofile',
            loadComponent: () =>
              import(
                './features/candidate/components/candidate-profile-public-view/candidate-profile-publicview'
              ).then((m) => m.CandidateProfilePublicViewComponent),
          },
        ],
      },
      {
        path: 'joblist',
        loadComponent: () =>
          import('./features/admin/components/admin-jobs/adminjobs').then(
            (m) => m.AdminJobsComponent
          ),
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/admin/components/admin-job-list/admin-joblist'
              ).then((m) => m.AdminJoblistComponent),
          },
          {
            path: 'viewjob',
            loadComponent: () =>
              import(
                './features/company/components/jobs-public-view/jobs-public-view'
              ).then((m) => m.JobsPublicViewComponent),
          },
        ],
      },
      {
        path: 'profile',
        loadComponent: () =>
          import(
            './features/admin/components/admin-profile/admin-profile'
          ).then((m) => m.AdminProfileComponent),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./common/not-found/not-found').then((m) => m.NotFoundComponent),
      },
    ],
  },

];
