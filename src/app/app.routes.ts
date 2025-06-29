import { Routes } from '@angular/router';
import { CandidateLogin } from './features/auth/components/candidates/candidate-login/candidate-login';
import { CandidateSignup } from './features/auth/components/candidates/candidate-signup/candidate-signup';
import { EmailVerificationFaild } from './features/auth/components/email-verification/email-verification-faild/email-verification-faild';
import { EmailVerificationSuccess } from './features/auth/components/email-verification/email-verification-success/email-verification-success';
import { EmailVerification } from './features/auth/components/email-verification/email-verification';
import { Candidatecomponent } from './features/layout/candidatecomponent/candidatecomponent';
import { CandidateHome } from './features/candidate/candidate-home/candidate-home';
import { Authcomponent } from './features/layout/authcomponent/authcomponent';
import { EmailComponent } from './features/layout/email-component/email-component';
import { Company } from './features/layout/company/company';
import { CompanyHome } from './features/company/company.home/company.home';

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
    }
];
