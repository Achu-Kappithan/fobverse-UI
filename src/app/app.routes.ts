import { Routes } from '@angular/router';
import { CandidateLogin } from './features/auth/components/auth/candidate-login/candidate-login';
import { CandidateSignup } from './features/auth/components/auth/candidate-signup/candidate-signup';
import { EmailVerificationFaild } from './features/auth/components/email-verification/email-verification-faild/email-verification-faild';
import { EmailVerificationSuccess } from './features/auth/components/email-verification/email-verification-success/email-verification-success';
import { EmailVerification } from './features/auth/components/email-verification/email-verification';
import { CandidateHome } from './features/candidate/candidate-home/candidate-home';
import { Authcomponent } from './features/layout/authcomponent/authcomponent';
import { CompanyHome } from './features/company/components/company.home/company.home';
import { ForgotPassEmail } from './features/auth/components/forgotPassword/forgot.pass.email/forgot.pass.email';
import { SetNewPassword } from './features/auth/components/forgotPassword/set-new-password/set-new-password';
import { UpdateProfileinfo } from './features/company/components/update-profileinfo/update-profileinfo';

// gurards 
import { isAdminGuard } from './shared/guards/is-admin-guard';
import { AddInternalUserComponent } from './features/company/components/internal-user.component/add-internal-user.component/add-internal-user.component';
import { UserListComponent } from './features/company/components/internal-user.component/user-list.component/user-list.component';


export const routes: Routes = [
  {
    path: '',
    component: Authcomponent,
    children: [

      // Auth

      {
        path: 'login',
        component: CandidateLogin,
        data: { userType: 'candidate' },
      },
      {
        path: 'signup',
        component: CandidateSignup,
        data: { userType: 'candidate' },
      },
      {
        path: 'adminlogin',
        component: CandidateLogin,
        data: { userType: 'admin' },
      },
      {
        path: 'companylogin',
        component: CandidateLogin,
        data: { userType: 'company' },
      },
      {
        path: 'companysignup',
        component: CandidateSignup,
        data: { userType: 'company' },
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
    loadComponent:()=> import ('./features/layout/email-component/email-component')
    .then(m =>m.EmailComponent),
    children: [
      { path: 'verification', component: EmailVerification },
      { path: 'failed', component: EmailVerificationFaild },
      { path: 'success', component: EmailVerificationSuccess },
    ],
  },

  // candidate 

  {
    path: 'candidate',
    loadComponent: ()=> import('./features/layout/candidatecomponent/candidatecomponent')
    .then(m =>m.Candidatecomponent),
    children: [
      {
        path: 'home',
        component: CandidateHome,
      },
    ],
  },

  //company

  {
    path: 'company',
    loadComponent:()=> import('./features/layout/company-component/company-component')
    .then (m => m.CompanyComponent),
    children: [
      {
        path: 'home',
        component: CompanyHome,
      },
      {
        path: 'profile',
        loadComponent: ()=> import ('./features/company/components/company-profile/company-profile')
        .then(m => m.CompanyProfile),
        children: [
          {
            path:'updateprofile',
            component: UpdateProfileinfo
          }
        ]
      },
      {
        path: 'internalusers',
        loadComponent : ()=> import ('./features/company/components/internal-user.component/internal-user.component')
        .then (m => m.InternalUserComponent),
        children:[
          {
            path: '',
            component: UserListComponent
          },
          {
            path: 'createuser',
            component: AddInternalUserComponent
          }
        ]
      }
    ],
  },

  // Admin

  {
    path: 'admin',
    loadComponent: ()=> import ('./features/layout/admin-component/admin-component')
    .then(m => m.AdminComponent),
    children: [
      {
        path: 'dashboard',
        canActivate: [isAdminGuard],
        loadComponent:()=> import ('./features/admin/components/admin-dashboard/admin-dashboard')
        .then (m => m.AdminDashboard),
      },
      {
        path: 'companyes',
        canActivate: [isAdminGuard],
        loadComponent: ()=> import ('./features/admin/components/admin-listcompanys/admin-listcompanys')
        .then (m => m.AdminListcompanys)
      },
      {
        path: 'candidates',
        canActivate: [isAdminGuard],
        loadComponent: ()=> import ('./features/admin/components/admin-candidates-list/admin-candidates-list')
        .then (m => m.AdminCandidatesList)
      },
    ],
  },

  // forgoPassword

  {
    path: 'forgotpassword',
    loadComponent: ()=> import ('./features/layout/forgotpasswordcomponent/forgotpasswordcomponent')
    .then (m => m.Forgotpasswordcomponent),
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
