import { Routes } from '@angular/router';
import { EmailVerificationFaild } from './features/auth/components/email-verification/email-verification-faild/email-verification-faild';
import { EmailVerificationSuccess } from './features/auth/components/email-verification/email-verification-success/email-verification-success';
import { EmailVerification } from './features/auth/components/email-verification/email-verification';
import { CandidateHome } from './features/candidate/components/candidate-home/candidate-home';
import { Authcomponent } from './features/layout/authcomponent/authcomponent';
import { CompanyHome } from './features/company/components/company.home/company.home';
import { ForgotPassEmail } from './features/auth/components/forgotPassword/forgot.pass.email/forgot.pass.email';
import { SetNewPassword } from './features/auth/components/forgotPassword/set-new-password/set-new-password';
import { UpdateProfileinfo } from './features/company/components/update-profileinfo/update-profileinfo';
import { APP_ROUTES } from './shared/constants/routes.constants';

// gurards
import { AddInternalUserComponent } from './features/company/components/internal-user.component/add-internal-user/add-internal-user.component';
import { UserListComponent } from './features/company/components/internal-user.component/user-list/user-list.component';
import { isLogoutGuard } from './shared/guards/auth_gurds/is-logout-guard';
import { authGurdGuard } from './shared/guards/auth_gurds/auth-gurd-guard';
import { isAdminGuard } from './shared/guards/admin_guards/is-admin-guard';
import { isCompanyAdminGuard } from './shared/guards/company_guards/is-company-admin.guard';
import { isHrUserGuard } from './shared/guards/company_guards/is-hr-user.guard';
import { isInterviewerGuard } from './shared/guards/company_guards/is-interviewer.guard';
import { CandidateLogin } from './features/auth/components/login/login';
import { CandidateSignup } from './features/auth/components/signup/signup';
import { CreateJob } from './features/company/components/create-job/create-job';
import { JobView } from './features/company/components/jobs/job-view/job-view';
import { JobEditing } from './features/company/components/jobs/job-editing/job-editing';
import { CompanyPublicProfile } from './features/company/components/company-public-profile/company-public-profile';
import { JobsPublicView } from './features/company/components/jobs-public-view/jobs-public-view';
  
export const routes: Routes = [
  {
    path: '',
    redirectTo: APP_ROUTES.HOME,
    pathMatch: 'full',
  },
  // forgoPassword

  {
    path: APP_ROUTES.FORGOT_PASSWORD,
    loadComponent: () =>
      import(
        './features/layout/forgotpasswordcomponent/forgotpasswordcomponent'
      ).then((m) => m.Forgotpasswordcomponent),
    children: [
      {
        path: 'email',
        component: ForgotPassEmail,
      },
      {
        path: 'newpassword',
        component: SetNewPassword,
      },
    ],
  },

  // email
  {
    path: 'email',
    loadComponent: () =>
      import('./features/layout/email-component/email-component').then(
        (m) => m.EmailComponent
      ),
    children: [
      { path: 'verification', component: EmailVerification },
      { path: 'failed', component: EmailVerificationFaild },
      { path: 'success', component: EmailVerificationSuccess },
    ],
  },

  {
    path: '',
    component: Authcomponent,
    children: [
      // Auth

      {
        path: APP_ROUTES.LOGIN,
        canActivate: [isLogoutGuard],
        component: CandidateLogin,
        data: { userType: 'candidate' },
      },
      {
        path: APP_ROUTES.SIGNUP,
        canActivate: [isLogoutGuard],
        component: CandidateSignup,
        data: { userType: 'candidate' },
      },
      {
        path: APP_ROUTES.ADMIN_LOGIN,
        canActivate: [isLogoutGuard],
        component: CandidateLogin,
        data: { userType: 'admin' },
      },
      {
        path: APP_ROUTES.COMPANY_LOGIN,
        canActivate: [isLogoutGuard],
        component: CandidateLogin,
        data: { userType: 'company_admin' },
      },
      {
        path: APP_ROUTES.COMPANY_SIGNUP,
        canActivate: [isLogoutGuard],
        component: CandidateSignup,
        data: { userType: 'company_admin' },
      },
    ],
  },



  // candidate

  {
    path: APP_ROUTES.CANDIDATE,
    loadComponent: () =>
      import('./features/layout/candidatecomponent/candidatecomponent').then(
        (m) => m.Candidatecomponent
      ),
    children: [
      {
        path: 'home',
        component: CandidateHome,
      },
      {
        path: 'profile',
        canActivate: [authGurdGuard],
        loadComponent: () =>
          import(
            './features/candidate/components/candidate-profile/candidate-profile'
          ).then((m) => m.CandidateProfile),
      },
      {
        path: 'profile/updateprofile',
        canActivate: [authGurdGuard],
        loadComponent: () =>
          import(
            './features/candidate/components/update-profile/update-profile'
          ).then((m) => m.UpdateProfile),
      },
      {
        path: 'settings',
        canActivate: [authGurdGuard],
        loadComponent: () =>
          import(
            './features/candidate/components/candidate-settings/candidate-settings'
          ).then((m) => m.CandidateSettings),
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
                './features/layout/video-layout-component/video-layout-component'
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
            './features/candidate/components/layout-jolist/layout-jolist'
          ).then((m) => m.LayoutJolist),
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/candidate/components/candidate-joblist/candidate-joblist'
              ).then((m) => m.CandidateJoblist),
          },
          {
            path: 'jobsview',
            loadComponent: () =>
              import(
                './features/company/components/jobs-public-view/jobs-public-view'
              ).then((m) => m.JobsPublicView),
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
                './features/candidate/components/candidate-companylist/candidate-companylist'
              ).then((m) => m.CandidateCompanylist),
          },
          {
            path: 'companyprofile',
            loadComponent: () =>
              import(
                './features/company/components/company-public-profile/company-public-profile'
              ).then((m) => m.CompanyPublicProfile),
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

  //company

  {
    path: APP_ROUTES.COMPANY,
    loadComponent: () =>
      import('./features/layout/company-component/company-component').then(
        (m) => m.CompanyComponent
      ),
    canActivate: [authGurdGuard, isInterviewerGuard],
    children: [
      {
        path: 'home',
        component: CompanyHome,
      },
      {
        path: 'profile',
        loadComponent: () =>
          import(
            './features/company/components/company-profile/company-profile'
          ).then((m) => m.CompanyProfile),
        children: [
          {
            path: 'updateprofile',
            component: UpdateProfileinfo,
            canActivate: [isCompanyAdminGuard],
          },
          {
            path: 'newjob',
            component: CreateJob,
            canActivate: [isHrUserGuard],
          },
          {
            path: 'publicview',
            component: CompanyPublicProfile,
          },
          {
            path: 'jobview',
            component: JobsPublicView,
          },
        ],
      },
      {
        path: 'internalusers',
        loadComponent: () =>
          import(
            './features/company/components/internal-user.component/internal-users.component'
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
          ).then((m) => m.UserProfile),
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
          import('./features/company/components/jobs/jobs').then((m) => m.Jobs),
        canActivate: [isInterviewerGuard],
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/company/components/jobs/jobs-list/jobs-list'
              ).then((m) => m.JobsList),
          },
          {
            path: 'jobview',
            component: JobView,
          },
          {
            path: 'jobedit',
            component: JobEditing,
            canActivate: [isHrUserGuard],
          },
          {
            path: 'applications/:id',
            loadComponent: () =>
              import(
                './features/company/components/company-application-layout/company-application-layout'
              ).then((m) => m.CompanyApplicationLayout),
            children: [
              {
                path: '',
                loadComponent: () =>
                  import(
                    './features/company/components/company-application-layout/company-jobapplications/company-jobapplications'
                  ).then((m) => m.CompanyJobapplications),
              },
              {
                path: 'viewprofile',
                loadComponent: () =>
                  import(
                    './features/candidate/components/candidate-profile-publicview/candidate-profile-publicview'
                  ).then((m) => m.CandidateProfilePublicview),
              },
              {
                path: 'viewapplication/:appId/:canId',
                loadComponent: () =>
                  import(
                    './features/layout/video-layout-component/video-layout-component'
              ).then((m) => m.VideoLayoutComponent),
                children: [
                  {
                    path: '',
                    loadComponent: () =>
                      import(
                        './features/company/components/company-application-layout/application-details/application-details'
                      ).then((m) => m.ApplicationDetails),
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
              ).then((m) => m.CompanyJobapplications),
          },
        ],
      },
      {
        path: '**',
        loadComponent: () =>
          import('./common/not-found/not-found').then((m) => m.NotFound),
      },
    ],
  },

  // Admin

  {
    path: APP_ROUTES.ADMIN,
    canActivate: [isAdminGuard, authGurdGuard],
    loadComponent: () =>
      import('./features/layout/admin-component/admin-component').then(
        (m) => m.AdminComponent
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './features/admin/components/admin-dashboard/admin-dashboard'
          ).then((m) => m.AdminDashboard),
      },
      {
        path: 'companies',
        loadComponent: () =>
          import('./features/admin/components/company/company').then(
            (m) => m.Company
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
              ).then((m) => m.CompanyPublicProfile),
          },
        ],
      },
      {
        path: 'candidates',
        loadComponent: () =>
          import('./features/admin/components/candidates/candidates').then(
            (m) => m.Candidates
          ),
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/admin/components/admin-candidates-list/admin-candidates-list'
              ).then((m) => m.AdminCandidatesList),
          },
          {
            path: 'viewprofile',
            loadComponent: () =>
              import(
                './features/candidate/components/candidate-profile-publicview/candidate-profile-publicview'
              ).then((m) => m.CandidateProfilePublicview),
          },
        ],
      },
      {
        path: 'joblist',
        loadComponent: () =>
          import('./features/admin/components/adminjobs/adminjobs').then(
            (m) => m.Adminjobs
          ),
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/admin/components/admin-joblist/admin-joblist'
              ).then((m) => m.AdminJoblist),
          },
          {
            path: 'viewjob',
            loadComponent: () =>
              import(
                './features/company/components/jobs-public-view/jobs-public-view'
              ).then((m) => m.JobsPublicView),
          },
        ],
      },
      {
        path: 'profile',
        loadComponent: () =>
          import(
            './features/admin/components/admin-profile/admin-profile'
          ).then((m) => m.AdminProfile),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./common/not-found/not-found').then((m) => m.NotFound),
      },
    ],
  },

];
