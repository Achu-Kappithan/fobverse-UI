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

// gurards
import { AddInternalUserComponent } from './features/company/components/internal-user.component/add-internal-user.component/add-internal-user.component';
import { UserListComponent } from './features/company/components/internal-user.component/user-list.component/user-list.component';
import { isLogoutGuard } from './shared/guards/auth_gurds/is-logout-guard';
import { authGurdGuard } from './shared/guards/auth_gurds/auth-gurd-guard';
import { isAdminGuard } from './shared/guards/admin_guards/is-admin-guard';
import { CandidateLogin } from './features/auth/components/login/login';
import { CandidateSignup } from './features/auth/components/signup/signup';
import { CreateJob } from './features/company/components/create-job/create-job';
import { JobView } from './features/company/components/jobs/job-view/job-view';
import { JobEditing } from './features/company/components/jobs/job-editing/job-editing';
import path from 'path';

export const routes: Routes = [
  {
    path: '',
    component: Authcomponent,
    children: [
      // Auth

      {
        path: 'login',
        canActivate: [isLogoutGuard],
        component: CandidateLogin,
        data: { userType: 'candidate' },
      },
      {
        path: 'signup',
        canActivate: [isLogoutGuard],
        component: CandidateSignup,
        data: { userType: 'candidate' },
      },
      {
        path: 'adminlogin',
        canActivate: [isLogoutGuard],
        component: CandidateLogin,
        data: { userType: 'admin' },
      },
      {
        path: 'companylogin',
        canActivate: [isLogoutGuard],
        component: CandidateLogin,
        data: { userType: 'company_admin' },
      },
      {
        path: 'companysignup',
        canActivate: [isLogoutGuard],
        component: CandidateSignup,
        data: { userType: 'company_admin' },
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
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

  // candidate

  {
    path: 'candidate',
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
        loadComponent: () =>
          import(
            './features/candidate/components/candidate-profile/candidate-profile'
          ).then((m) => m.CandidateProfile),
      },
      {
        path: 'profile/updateprofile',
        loadComponent: () =>
          import(
            './features/candidate/components/update-profile/update-profile'
          ).then((m) => m.UpdateProfile),
      },
      {
        path: 'joblist',
        loadComponent: ()=> import ('./features/candidate/components/layout-jolist/layout-jolist')
        .then( m => m.LayoutJolist),
        children:[
          {
            path:'',
            loadComponent: ()=> import('./features/candidate/components/candidate-joblist/candidate-joblist')
            .then(m => m.CandidateJoblist)
          },
          {
            path: 'jobsview',
            loadComponent: ()=> import('./features/company/components/jobs-public-view/jobs-public-view')
            .then( m => m.JobsPublicView)
          }
        ]
      },
      {
        path: "joblist/companyprofile",
        loadComponent: ()=> import('./features/company/components/company-public-profile/company-public-profile')
        .then(m => m.CompanyPublicProfile)
      }
    ],
  },

  //company

  {
    path: 'company',
    loadComponent: () =>
      import('./features/layout/company-component/company-component').then(
        (m) => m.CompanyComponent
      ),
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
          },
          {
            path: 'newjob',
            component: CreateJob,
          },
        ],
      },
      {
        path: 'internalusers',
        loadComponent: () =>
          import(
            './features/company/components/internal-user.component/internal-user.component'
          ).then((m) => m.InternalUserComponent),
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
        path: 'joblist',
        loadComponent: () =>
          import('./features/company/components/jobs/jobs').then((m) => m.Jobs),
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
    path: 'admin',
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
        path: 'companyes',
        loadComponent: ()=> import('./features/admin/components/company/company')
        .then(m => m.Company),
        children:[
          {
            path: '',
            loadComponent: ()=> import ('./features/admin/components/admin-listcompanys/admin-listcompanys')
            .then( m => m.AdminListcompanys)
          },
          {
            path: "viewprofile",
            loadComponent: () => import('./features/company/components/company-public-profile/company-public-profile')
            .then( m=> m.CompanyPublicProfile)
          }
        ]
      },
      {
        path: 'candidates',
          loadComponent: ()=> import('./features/admin/components/candidates/candidates')
          .then(m => m.Candidates),
          children:[
            {
              path: '',
              loadComponent : ()=> import('./features/admin/components/admin-candidates-list/admin-candidates-list')
              .then(m => m.AdminCandidatesList)
            },
            {
              path: 'viewprofile',
              loadComponent : ()=> import('./features/candidate/components/candidate-profile-publicview/candidate-profile-publicview')
              .then(m => m.CandidateProfilePublicview)
            }
          ]
      },
      {
        path: 'joblist',
        loadComponent: () => import ('./features/admin/components/adminjobs/adminjobs')
        .then(m=> m.Adminjobs),
        children:[
          {
            path: '',
            loadComponent:()=> import('./features/admin/components/admin-joblist/admin-joblist')
            .then(m => m.AdminJoblist)
          },
          {
            path: 'viewjob',
            loadComponent: () => import('./features/company/components/jobs-public-view/jobs-public-view')
            .then(m => m.JobsPublicView)
          }
        ]
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

  // forgoPassword

  {
    path: 'forgotpassword',
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
];
