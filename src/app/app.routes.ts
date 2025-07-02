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
import { Company } from './features/layout/company/company';
import { CompanyHome } from './features/company/company.home/company.home';
import { AdminComponent } from './features/layout/admin-component/admin-component';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { Forgotpasswordcomponent } from './features/layout/forgotpasswordcomponent/forgotpasswordcomponent';
import { ForgotPassEmail } from './features/auth/components/forgotPassword/forgot.pass.email/forgot.pass.email';
import { SetNewPassword } from './features/auth/components/forgotPassword/set-new-password/set-new-password';

export const routes: Routes = [
    {
        path:"",
        component : Authcomponent,
        children:[
            {
                path:"login", 
                component : CandidateLogin,
                data:{userType:'candidate'}
            },
            {
                path:"signup",
                component: CandidateSignup,
                data:{userType:'candidate'}
            },
           {
                path:"adminlogin",
                component: CandidateLogin,
                data: {userType: "admin"}
            },
            {
                path: "",
                redirectTo:'login',
                pathMatch:'full'
            }
        ]
    },
    {
        path: "email",
        component: EmailComponent,
        children: [
            { path:"verification", component:EmailVerification},
            { path:"failed", component:EmailVerificationFaild},
            { path:"success", component:EmailVerificationSuccess},
        ]
    },
    {
        path:'candidate',
        component: Candidatecomponent,
        children:[
            {
                path:'home',
                component: CandidateHome
            },
        ]
    },


    //company
    {
        path:'company',
        component:Company,
        children:[
            {
                path:'login',
                component:CandidateLogin,
                data:{userType:'company'}
            },
            {
                path:'signup',
                component:CandidateSignup,
                data:{userType:'company'}
            },
            {
                path:'home',
                component:CompanyHome
            }
        ]
    },

    // Admin

    {
        path:"admin",
        component: AdminComponent,
        children:[
            {
                path: "dashboard",
                component: AdminDashboard,
            }
        ]
    },


    // forgoPassword

    {
        path:"forgotpassword",
        component : Forgotpasswordcomponent,
        children : [
            {
                path: "email",
                component: ForgotPassEmail
            },
            {
                path: 'newpassword',
                component: SetNewPassword
            }
        ]
    }
];
