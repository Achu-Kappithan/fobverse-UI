import { Routes } from '@angular/router';
import { CandidateLogin } from './features/auth/components/auth/candidate-login/candidate-login';
import { CandidateSignup } from './features/auth/components/auth/candidate-signup/candidate-signup';
import { EmailVerificationFaild } from './features/auth/components/email-verification/email-verification-faild/email-verification-faild';
import { EmailVerificationSuccess } from './features/auth/components/email-verification/email-verification-success/email-verification-success';
import { EmailVerification } from './features/auth/components/email-verification/email-verification';
import { Candidatecomponent } from './features/layout/candidatecomponent/candidatecomponent';
import { CandidateHome } from './features/candidate/candidate-home/candidate-home';
import { Authcomponent } from './features/layout/authcomponent/authcomponent';
import { EmailComponent } from './features/layout/email-component/email-component';
import { CompanyHome } from './features/company/components/company.home/company.home';
import { AdminComponent } from './features/layout/admin-component/admin-component';
import { AdminDashboard } from './features/admin/components/admin-dashboard/admin-dashboard';
import { Forgotpasswordcomponent } from './features/layout/forgotpasswordcomponent/forgotpasswordcomponent';
import { ForgotPassEmail } from './features/auth/components/forgotPassword/forgot.pass.email/forgot.pass.email';
import { SetNewPassword } from './features/auth/components/forgotPassword/set-new-password/set-new-password';
import { AdminListcompanys } from './features/admin/components/admin-listcompanys/admin-listcompanys';
import { AdminCandidatesList } from './features/admin/components/admin-candidates-list/admin-candidates-list';
import { authGuard } from './shared/guards/auth-guard';
import { isAdminGuard } from './shared/guards/is-admin-guard';
import { CompanyComponent } from './features/layout/company-component/company-component';
import { CompanyProfile } from './features/company/components/company-profile/company-profile';
import { UpdateProfileinfo } from './features/company/components/update-profileinfo/update-profileinfo';

export const routes: Routes = [
  {
    path: '',
    component: Authcomponent,
    children: [
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
  {
    path: 'email',
    component: EmailComponent,
    children: [
      { path: 'verification', component: EmailVerification },
      { path: 'failed', component: EmailVerificationFaild },
      { path: 'success', component: EmailVerificationSuccess },
    ],
  },
  {
    path: 'candidate',
    component: Candidatecomponent,
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
    component: CompanyComponent,
    children: [
      {
        path: 'home',
        component: CompanyHome,
      },
      {
        path: 'profile',
        component: CompanyProfile,
        children: [
          {
            path:'updateprofile',
            component: UpdateProfileinfo
          }
        ]
      }
    ],
  },

  // Admin

  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'dashboard',
        canActivate: [isAdminGuard],
        component: AdminDashboard,
      },
      {
        path: 'companyes',
        canActivate: [isAdminGuard],
        component: AdminListcompanys,
      },
      {
        path: 'candidates',
        canActivate: [isAdminGuard],
        component: AdminCandidatesList,
      },
    ],
  },

  // forgoPassword

  {
    path: 'forgotpassword',
    component: Forgotpasswordcomponent,
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
